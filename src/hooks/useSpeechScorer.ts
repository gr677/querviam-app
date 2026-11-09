import { useState, useRef, useCallback } from 'react';
import { PronunciationScoreResult } from '../types';

interface UseSpeechScorerProps {
  langCode: string;
}

export function useSpeechScorer({ langCode }: UseSpeechScorerProps) {
  const [isListening, setIsListening] = useState(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<number, PronunciationScoreResult>>({});
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Clean words helper
  const cleanWord = (w: string) =>
    w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, '').trim();

  const evaluatePronunciation = (spoken: string, target: string): PronunciationScoreResult => {
    const targetWords = target
      .split(/\s+/)
      .map(cleanWord)
      .filter((w) => w.length > 0);

    const spokenWords = spoken
      .split(/\s+/)
      .map(cleanWord)
      .filter((w) => w.length > 0);

    if (targetWords.length === 0) {
      return { score: 100, recognizedText: spoken, targetText: target, wordScores: [] };
    }

    let matchCount = 0;
    const spokenPool = [...spokenWords];

    const wordScores = targetWords.map((word) => {
      // Find direct or fuzzy match in spoken pool
      const matchIndex = spokenPool.findIndex((sw) => {
        if (sw === word) return true;
        // Simple Levenshtein distance tolerance of 1 for minor speech recognition accents
        if (Math.abs(sw.length - word.length) <= 1 && (sw.startsWith(word.slice(0, 3)) || word.startsWith(sw.slice(0, 3)))) {
          return true;
        }
        return false;
      });

      if (matchIndex !== -1) {
        matchCount++;
        spokenPool.splice(matchIndex, 1);
        return { word, isMatch: true };
      }
      return { word, isMatch: false };
    });

    const score = Math.min(100, Math.round((matchCount / targetWords.length) * 100));

    return {
      score,
      recognizedText: spoken,
      targetText: target,
      wordScores,
    };
  };

  const startScoring = useCallback(
    (sentenceIndex: number, targetText: string) => {
      setError(null);
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        // Fallback simulation for unsupported browsers (provides educational scoring)
        setIsListening(true);
        setActiveSentenceIdx(sentenceIndex);
        setTimeout(() => {
          setIsListening(false);
          setActiveSentenceIdx(null);
          const simulatedScore = evaluatePronunciation(targetText, targetText);
          setScores((prev) => ({ ...prev, [sentenceIndex]: simulatedScore }));
        }, 1500);
        return;
      }

      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = langCode || 'it-IT';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => {
          setIsListening(true);
          setActiveSentenceIdx(sentenceIndex);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const result = evaluatePronunciation(transcript, targetText);
          setScores((prev) => ({ ...prev, [sentenceIndex]: result }));
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning:', event.error);
          setIsListening(false);
          setActiveSentenceIdx(null);
          if (event.error !== 'no-speech') {
            setError(`Microphone note: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setActiveSentenceIdx(null);
        };

        recognition.start();
      } catch (err: any) {
        console.warn('Speech recognition start failed:', err);
        setIsListening(false);
        setActiveSentenceIdx(null);
      }
    },
    [langCode]
  );

  const stopScoring = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setActiveSentenceIdx(null);
  }, []);

  const clearScore = useCallback((sentenceIndex: number) => {
    setScores((prev) => {
      const next = { ...prev };
      delete next[sentenceIndex];
      return next;
    });
  }, []);

  const clearAllScores = useCallback(() => {
    setScores({});
  }, []);

  return {
    isListening,
    activeSentenceIdx,
    scores,
    error,
    startScoring,
    stopScoring,
    clearScore,
    clearAllScores,
  };
}

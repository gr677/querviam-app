import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Eye,
  EyeOff,
  Lightbulb,
  MessageSquare,
  Bot,
  User,
  RotateCcw,
} from 'lucide-react';
import { StoryData, ConversationMessage } from '../types';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  targetLang: string;
  baseLang: string;
  difficulty: string;
  onSpeak: (text: string) => void;
}

export const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  story,
  targetLang,
  baseLang,
  difficulty,
  onSpeak,
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [revealedBase, setRevealedBase] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const initialInputTextRef = useRef<string>('');

  // Clean up recognition & timers on unmount or close
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  }, [isOpen]);

  // Initialize conversation with a friendly opening question based on the story
  useEffect(() => {
    if (!isOpen || !story) return;

    if (messages.length === 0) {
      const partnerName = story.contentType === 'discussion' ? 'Partner (Locutor)' : 'Native Guide';
      const initialGreeting = getInitialGreeting(targetLang, story.title_target, baseLang);

      setMessages([
        {
          id: 'msg-0',
          role: 'assistant',
          targetText: initialGreeting.target,
          baseText: initialGreeting.base,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [isOpen, story, targetLang, baseLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen || !story) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ConversationMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      targetText: textToSend,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const storyContext = story.sentences.slice(0, 3).map((s) => s.target).join(' ');
      const res = await fetch('/api/chat-converse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: story.title_target,
          storyContext,
          targetLang,
          baseLang,
          difficulty,
          messages: nextMessages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.targetText,
          })),
          userMessage: textToSend,
        }),
      });

      const data = await res.json();
      if (data && data.reply_target) {
        const assistantMsg: ConversationMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          targetText: data.reply_target,
          baseText: data.reply_base,
          feedbackTip: data.feedback_tip || undefined,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Conversation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    const initialGreeting = getInitialGreeting(targetLang, story.title_target, baseLang);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        targetText: initialGreeting.target,
        baseText: initialGreeting.base,
        timestamp: Date.now(),
      },
    ]);
  };

  const SILENCE_TIMEOUT_MS = 5000; // 5 seconds of silence allowed
  const INITIAL_WAIT_MS = 8000; // 8 seconds to begin speaking

  const resetSilenceTimer = (duration = SILENCE_TIMEOUT_MS) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    silenceTimerRef.current = setTimeout(() => {
      stopRecording();
    }, duration);
  };

  const stopRecording = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    isRecordingRef.current = false;
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your response instead.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = getLangCode(targetLang);
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      const prefix = inputText.trim() ? `${inputText.trim()} ` : '';
      initialInputTextRef.current = prefix;

      recognition.onstart = () => {
        setIsRecording(true);
        isRecordingRef.current = true;
        resetSilenceTimer(INITIAL_WAIT_MS);
      };

      recognition.onspeechstart = () => {
        resetSilenceTimer(SILENCE_TIMEOUT_MS);
      };

      recognition.onaudiostart = () => {
        resetSilenceTimer(SILENCE_TIMEOUT_MS);
      };

      recognition.onsoundstart = () => {
        resetSilenceTimer(SILENCE_TIMEOUT_MS);
      };

      recognition.onresult = (event: any) => {
        // Reset 5s timeout on any speech activity so user has a full 5 seconds between phrases
        resetSilenceTimer(SILENCE_TIMEOUT_MS);

        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript + ' ';
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const combined = `${initialInputTextRef.current}${finalTranscript}${interimTranscript}`.trim();
        setInputText(combined);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e.error);
        if (e.error === 'no-speech' || e.error === 'aborted') {
          // Allow the silence timer to govern the timeout
          return;
        }
        if (e.error === 'not-allowed') {
          stopRecording();
        }
      };

      recognition.onend = () => {
        // Prevent aggressive mobile WebKit/Chrome disconnects (after 0.5s - 1s pause)
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch {
            // Keep listening until 5-second silence timer fires
          }
        } else {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition initiation error:', e);
      stopRecording();
    }
  };

  const starterChips = getStarterChips(targetLang, story.title_target);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden h-[92dvh] sm:h-[90vh] sm:max-h-[750px] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Optimized for mobile so close button is never pushed off-screen */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-4 bg-linear-to-r from-emerald-800 to-teal-900 text-white shadow-xs shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xs shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base leading-tight truncate">Conversation Partner</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/40 shrink-0">
                  {difficulty}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 truncate">
                About: <span className="italic font-serif">{story.title_target}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleResetConversation}
              className="p-1.5 sm:p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-white bg-white/20 hover:bg-white/30 active:scale-95 transition flex items-center justify-center cursor-pointer shadow-xs"
              title="Close chat"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isBaseRevealed = revealedBase[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 shadow-2xs text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div
                    className={`p-3.5 rounded-2xl shadow-xs text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.targetText}</p>

                    {/* Translation for assistant message */}
                    {!isUser && isBaseRevealed && msg.baseText && (
                      <p className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-sans italic">
                        {msg.baseText}
                      </p>
                    )}
                  </div>

                  {/* Actions for Assistant Message */}
                  {!isUser && (
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => onSpeak(msg.targetText)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition font-medium"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>

                      {msg.baseText && (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedBase((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id],
                            }))
                          }
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 transition font-medium ml-1"
                        >
                          {isBaseRevealed ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Translate</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Feedback Coach Tip */}
                  {msg.feedbackTip && (
                    <div className="flex items-start gap-1.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 animate-fade-in shadow-2xs">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-amber-950">Coach Tip: </strong>
                        <span>{msg.feedbackTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 max-w-[75%] mr-auto text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs animate-pulse">
              <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Thinking in {targetLang}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Conversation Starter Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex flex-wrap gap-1.5 text-xs shrink-0">
            <span className="font-semibold text-slate-500 text-[11px] self-center mr-1">
              Suggestions:
            </span>
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 border border-slate-300 text-slate-700 rounded-lg transition font-medium shadow-2xs active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Recording Status Banner */}
        {isRecording && (
          <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-xs text-rose-900 flex items-center justify-between shrink-0 animate-fade-in font-medium">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span>Listening in {targetLang}... 5s pause timeout (take your time)</span>
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="text-[11px] font-bold text-rose-700 hover:text-rose-950 underline cursor-pointer"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-1.5 sm:gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer shrink-0 sm:hidden"
            title="Exit chat"
          >
            Exit
          </button>

          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition shadow-xs cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-slate-200 border-slate-200'
            }`}
            title={isRecording ? 'Listening (5s pause detection)... Tap to stop' : 'Tap to speak your answer'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type or speak in ${targetLang}...`}
            className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl transition shadow-xs font-semibold cursor-pointer active:scale-95 shrink-0"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

function getInitialGreeting(
  targetLang: string,
  title: string,
  baseLang: string
): { target: string; base: string } {
  const isIt = targetLang.toLowerCase().includes('it');
  const isEs = targetLang.toLowerCase().includes('es') || targetLang.toLowerCase().includes('span');
  const isFr = targetLang.toLowerCase().includes('fr');
  const isDe = targetLang.toLowerCase().includes('de') || targetLang.toLowerCase().includes('germ');

  if (isIt) {
    return {
      target: `Ciao! Ho appena letto "${title}". Che cosa ne pensi di questa storia?`,
      base: `Hi! I just read "${title}". What do you think of this story?`,
    };
  } else if (isEs) {
    return {
      target: `¡Hola! Acabo de leer "${title}". ¿Qué opinas de esta historia?`,
      base: `Hello! I just read "${title}". What do you think of this story?`,
    };
  } else if (isFr) {
    return {
      target: `Bonjour ! Je viens de lire "${title}". Qu'en penses-tu ?`,
      base: `Hello! I just read "${title}". What do you think of it?`,
    };
  } else if (isDe) {
    return {
      target: `Hallo! Ich habe gerade "${title}" gelesen. Wie findest du diese Geschichte?`,
      base: `Hello! I just read "${title}". How do you like this story?`,
    };
  }

  return {
    target: `Hello! I just read "${title}". What do you think of this story?`,
    base: `Hello! I just read "${title}". What do you think of this story?`,
  };
}

function getStarterChips(targetLang: string, title: string): string[] {
  const isIt = targetLang.toLowerCase().includes('it');
  const isEs = targetLang.toLowerCase().includes('es') || targetLang.toLowerCase().includes('span');
  const isFr = targetLang.toLowerCase().includes('fr');
  const isDe = targetLang.toLowerCase().includes('de');

  if (isIt) {
    return [
      'Mi piace molto questa storia!',
      'Vorrei visitare questo posto.',
      'Qual è la parte più interessante?',
    ];
  } else if (isEs) {
    return [
      '¡Me gusta mucho esta historia!',
      'Me gustaría visitar este lugar.',
      '¿Cuál es tu parte favorita?',
    ];
  } else if (isFr) {
    return [
      "J'aime beaucoup cette histoire !",
      'Je voudrais visiter cet endroit.',
      'Quelle est la partie la plus intéressante ?',
    ];
  } else if (isDe) {
    return [
      'Diese Geschichte gefällt mir sehr gut!',
      'Ich möchte diesen Ort gerne besuchen.',
      'Was ist der interessanteste Teil?',
    ];
  }

  return [
    'I really like this story!',
    'I would love to visit this place.',
    "What is your favorite part?",
  ];
}

function getLangCode(langName: string): string {
  const map: Record<string, string> = {
    Italian: 'it-IT',
    English: 'en-US',
    Spanish: 'es-ES',
    French: 'fr-FR',
    German: 'de-DE',
    Portuguese: 'pt-PT',
    Dutch: 'nl-NL',
    Norwegian: 'no-NO',
  };
  return map[langName] || 'it-IT';
}

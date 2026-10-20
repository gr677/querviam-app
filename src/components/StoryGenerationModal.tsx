import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';

interface StoryGenerationModalProps {
  isOpen: boolean;
  isReady: boolean;
  topic: string;
  baseLang: string;
  targetLang: string;
  targetLangFlag?: string;
  onDone: () => void;
  onSpeakText?: (text: string) => void;
}

// Localized boilerplate text for "Creating you a story for " in the learner's "I SPEAK" language
export function getCreatingStoryPrefix(baseLang: string): string {
  const map: Record<string, string> = {
    English: 'Creating you a story for ',
    Italian: 'Creazione di una storia per ',
    Spanish: 'Creando una historia sobre ',
    French: 'Création d’une histoire sur ',
    German: 'Erstelle eine Geschichte über ',
    Portuguese: 'Criando uma história sobre ',
    Japanese: '次のテーマで物語を作成中: ',
    Korean: '다음 주제로 이야기를 만드는 중입니다: ',
    Chinese: '正在为您创作故事：',
    Russian: 'Создание истории на тему: ',
    Arabic: 'جارٍ إنشاء قصة حول: ',
    Dutch: 'Een verhaal maken over ',
    Polish: 'Tworzenie opowiadania na temat: ',
    Greek: 'Δημιουργία ιστορίας για ',
    Hebrew: 'יוצר עבורך סיפור על ',
    Hindi: 'के लिए आपकी कहानी बनाई जा रही है: ',
    Indonesian: 'Membuat cerita untuk ',
    Norwegian: 'Lager en historie om ',
    Romanian: 'Se creează o poveste despre ',
    Swedish: 'Skapar en berättelse om ',
    Turkish: 'Şunun için bir hikaye oluşturuluyor: ',
    Vietnamese: 'Đang tạo câu chuyện cho ',
    Danish: 'Opretter en historie om ',
    Finnish: 'Luodaan tarina aiheesta ',
    Czech: 'Vytváření příběhu na téma ',
    Hungarian: 'Történet készítése erről: ',
    Marathi: 'या विषयावर कथा तयार करत आहे: ',
  };

  return map[baseLang] || 'Creating you a story for ';
}

// Localized "Your story is ready!" heading
export function getStoryReadyTitle(baseLang: string): string {
  const map: Record<string, string> = {
    English: 'Your story is ready!',
    Italian: 'La tua storia è pronta!',
    Spanish: '¡Tu historia está lista!',
    French: 'Votre histoire est prête !',
    German: 'Deine Geschichte ist fertig!',
    Portuguese: 'Sua história está pronta!',
    Japanese: '物語が完成しました！',
    Korean: '이야기가 완성되었습니다!',
    Chinese: '您的故事已准备就绪！',
    Russian: 'Ваша история готова!',
    Arabic: 'قصتك جاهزة!',
    Dutch: 'Je verhaal is klaar!',
    Polish: 'Twoje opowiadanie jest gotowe!',
    Greek: 'Η ιστορία σας είναι έτοιμη!',
    Hebrew: 'הסיפור שלך מוכן!',
    Hindi: 'आपकी कहानी तैयार है!',
    Indonesian: 'Cerita Anda sudah siap!',
    Norwegian: 'Historien din er klar!',
    Romanian: 'Povestea ta este gata!',
    Swedish: 'Din berättelse är klar!',
    Turkish: 'Hikayeniz hazır!',
    Vietnamese: 'Câu chuyện của bạn đã sẵn sàng!',
    Danish: 'Din historie er klar!',
    Finnish: 'Tarinasi on valmis!',
    Czech: 'Váš příběh je připraven!',
    Hungarian: 'A történeted elkészült!',
    Marathi: 'तुमची कथा तयार आहे!',
  };

  return map[baseLang] || 'Your story is ready!';
}

// Localized "Done" button text in the learner's "I SPEAK" language
export function getDoneButtonText(baseLang: string): string {
  const map: Record<string, string> = {
    English: 'Done • Read Story',
    Italian: 'Fatto • Leggi la storia',
    Spanish: 'Listo • Leer historia',
    French: 'Terminé • Lire l’histoire',
    German: 'Fertig • Geschichte lesen',
    Portuguese: 'Pronto • Ler história',
    Japanese: '完了 • 物語を読む',
    Korean: '완료 • 이야기 읽기',
    Chinese: '完成 • 阅读故事',
    Russian: 'Готово • Читать историю',
    Arabic: 'تم • قراءة القصة',
    Dutch: 'Klaar • Lees verhaal',
    Polish: 'Gotowe • Czytaj opowiadanie',
    Greek: 'Έτοιμο • Διαβάστε την ιστορία',
    Hebrew: 'סיום • קרא סיפור',
    Hindi: 'हो गया • कहानी पढ़ें',
    Indonesian: 'Selesai • Baca Cerita',
    Norwegian: 'Ferdig • Les historien',
    Romanian: 'Gata • Citește povestea',
    Swedish: 'Klar • Läs berättelsen',
    Turkish: 'Bitti • Hikayeyi Oku',
    Vietnamese: 'Xong • Đọc câu chuyện',
    Danish: 'Færdig • Læs historien',
    Finnish: 'Valmis • Lue tarina',
    Czech: 'Hotovo • Číst příběh',
    Hungarian: 'Kész • Történet olvasása',
    Marathi: 'पूर्ण झाले • कथा वाचा',
  };

  return map[baseLang] || 'Done • Read Story';
}

export const StoryGenerationModal: React.FC<StoryGenerationModalProps> = ({
  isOpen,
  isReady,
  topic,
  baseLang,
  targetLang,
  targetLangFlag = '📖',
  onDone,
  onSpeakText,
}) => {
  const [progress, setProgress] = useState(15);
  const [stepText, setStepText] = useState('Weaving sentences & vocabulary...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      return;
    }

    if (isReady) {
      setProgress(100);
      setStepText('Complete! Tap Done to start reading.');
      return;
    }

    const t1 = setTimeout(() => {
      setProgress(40);
      setStepText(`Drafting in ${targetLang}...`);
    }, 1000);

    const t2 = setTimeout(() => {
      setProgress(75);
      setStepText('Adding verb notes & bilingual translations...');
    }, 2200);

    const t3 = setTimeout(() => {
      setProgress(95);
      setStepText('Polishing audio phonetics & exercises...');
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, isReady, targetLang]);

  if (!isOpen) return null;

  const prefix = getCreatingStoryPrefix(baseLang);
  const readyTitle = getStoryReadyTitle(baseLang);
  const doneBtnText = getDoneButtonText(baseLang);
  const cleanTopic = topic.trim() || 'A day of new discoveries';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-5 sm:p-8 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Top Header & Visual Progress */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            {isReady ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-[#008450] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-8 ring-emerald-100 animate-bounce-subtle">
                <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-50 animate-pulse">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 text-2xl shadow-xs">
              {targetLangFlag}
            </span>
          </div>

          <div>
            {isReady ? (
              <>
                <h2
                  id="generation-modal-title"
                  className="text-lg sm:text-2xl font-black text-slate-900 leading-snug tracking-tight"
                >
                  🎉 {readyTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  “{cleanTopic}”
                </p>
              </>
            ) : (
              <>
                <h2
                  id="generation-modal-title"
                  className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug tracking-tight"
                >
                  <span>{prefix}</span>
                  <span className="text-[#008450] font-black break-words">“{cleanTopic}”</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {stepText}
                </p>
              </>
            )}
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isReady
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 w-full'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Big "Done" Button when ready */}
          {isReady && (
            <div className="pt-2 animate-fade-in">
              <button
                type="button"
                onClick={onDone}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#008450] hover:bg-[#006b40] text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-800/25 hover:shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer ring-4 ring-emerald-100"
              >
                <span>{doneBtnText}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Generous White Space separating creation notice / Done button from advert */}
        <div className="py-5 sm:py-7 flex items-center justify-center">
          <div className="w-24 border-t border-slate-200/80" />
        </div>

        {/* Learning Feature Spotlight (AdSense Policy Compliant: No Google-served ads on modals/alerts) */}
        <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-xs text-slate-600">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#008450]" />
              <span>Language Learning Tip</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Immersion Technique
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Reading graded sentences with audio phonetics builds natural comprehension 3x faster than isolated vocabulary memorization. Click any word in your story for roots and etymology.
          </p>
        </div>
      </div>
    </div>
  );
};

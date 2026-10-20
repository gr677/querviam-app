import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  BookOpen,
  Layers,
  CheckSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { StoryData, GrammarBite, QuizQuestion } from '../types';
import { isChinese, segmentChinese } from '../utils/chineseUtils';

interface StudySheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
  targetLang: string;
  baseLang?: string;
  difficulty: string;
  tense: string;
}

export const StudySheetModal: React.FC<StudySheetModalProps> = ({
  isOpen,
  onClose,
  story,
  targetLang,
  baseLang = 'English',
  difficulty,
  tense,
}) => {
  // Selectable Options for the Study Sheet
  const [includeStoryText, setIncludeStoryText] = useState(true);
  const [includeTranslations, setIncludeTranslations] = useState(true);
  const [includeSentenceNumbers, setIncludeSentenceNumbers] = useState(true);
  const [includeVocab, setIncludeVocab] = useState(true);
  const [includeGrammar, setIncludeGrammar] = useState(true);
  const [includeClozeWorksheet, setIncludeClozeWorksheet] = useState(true);
  const [includeClozeWordBank, setIncludeClozeWordBank] = useState(true);
  const [includeClozeHints, setIncludeClozeHints] = useState(true);
  const [includeQuiz, setIncludeQuiz] = useState(true);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [layoutStyle, setLayoutStyle] = useState<'interlinear' | 'columns'>('interlinear');

  // Interactive quiz test in preview mode
  const [quizTestAnswers, setQuizTestAnswers] = useState<Record<number, number>>({});

  // Export to Anki / Quizlet modal state
  const [isAnkiExportOpen, setIsAnkiExportOpen] = useState(false);
  const [ankiExportScope, setAnkiExportScope] = useState<'both' | 'vocab' | 'sentences'>('both');
  const [ankiExportFormat, setAnkiExportFormat] = useState<'tsv' | 'csv'>('tsv');
  const [ankiCopied, setAnkiCopied] = useState(false);

  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !story) return null;

  // Extract all verbs for vocabulary table
  const allVerbs = story.sentences.flatMap((s) => s.verbs || []);
  const uniqueVerbs = Array.from(
    new Map(allVerbs.map((v) => [v.infinitive.toLowerCase().trim(), v])).values()
  );

  // Extract words for Cloze word bank
  const clozeWordBank = useMemo(() => {
    const list: string[] = [];
    story.sentences.forEach((s, idx) => {
      const isTargetCh = isChinese(targetLang, s.target) || isChinese(story._meta?.targetLang);
      if (isTargetCh) {
        const segs = segmentChinese(s.target);
        const wordCandidates = segs.filter((seg) => seg.isWord && seg.text.length >= 2);
        if (wordCandidates.length > 0) {
          list.push(wordCandidates[idx % wordCandidates.length].text);
        }
      } else {
        const words = s.target.replace(/[.,!?;:"'«»]/g, '').split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          const blankIdx = (idx * 2 + 1) % words.length;
          list.push(words[blankIdx]);
        }
      }
    });
    // Shuffle word bank
    return Array.from(new Set(list)).sort(() => Math.random() - 0.5);
  }, [story, targetLang]);

  // Generate Anki / Quizlet export cards
  const ankiExportText = useMemo(() => {
    const cards: { front: string; back: string; notes?: string }[] = [];

    // 1. Vocabulary & Verbs
    if (ankiExportScope === 'vocab' || ankiExportScope === 'both') {
      uniqueVerbs.forEach((v) => {
        const conjSample = v.conjugations
          ? Object.entries(v.conjugations)
              .map(([t, list]) => `${t}: ${list.slice(0, 3).map((c) => `${c.person ? c.person + ' ' : ''}${c.form}`).join(', ')}`)
              .join('; ')
          : '';
        const notes = conjSample ? `Sample: ${conjSample}` : '';
        cards.push({
          front: v.infinitive,
          back: v.translation,
          notes,
        });
      });
    }

    // 2. Sentences
    if (ankiExportScope === 'sentences' || ankiExportScope === 'both') {
      story.sentences.forEach((s) => {
        cards.push({
          front: s.target,
          back: s.en,
          notes: story.title_target,
        });
      });
    }

    const separator = ankiExportFormat === 'tsv' ? '\t' : ',';
    return cards
      .map((c) => {
        const cleanFront = c.front.replace(/\t/g, ' ').replace(/\n/g, ' ');
        const cleanBack = (c.notes ? `${c.back} (${c.notes})` : c.back)
          .replace(/\t/g, ' ')
          .replace(/\n/g, ' ');

        if (ankiExportFormat === 'csv') {
          return `"${cleanFront.replace(/"/g, '""')}","${cleanBack.replace(/"/g, '""')}"`;
        }
        return `${cleanFront}${separator}${cleanBack}`;
      })
      .join('\n');
  }, [story, uniqueVerbs, ankiExportScope, ankiExportFormat]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# ${story.title_target} (${story.title_en})\n`;
    md += `**Language:** ${targetLang} | **Level:** ${difficulty} | **Tense:** ${tense}\n\n`;

    if (includeStoryText) {
      md += `## 📖 Reading Text\n\n`;
      story.sentences.forEach((s, idx) => {
        const num = includeSentenceNumbers ? `${idx + 1}. ` : '';
        md += `${num}**${s.target}**\n`;
        if (includeTranslations) {
          md += `   *${s.en}*\n`;
        }
        md += `\n`;
      });
    }

    if (includeVocab && uniqueVerbs.length > 0) {
      md += `## 📚 Vocabulary & Verbs\n\n| Word / Verb | ${baseLang} | Key Conjugations |\n|---|---|---|\n`;
      uniqueVerbs.forEach((v) => {
        const conjSample = v.conjugations
          ? Object.entries(v.conjugations)
              .map(([t, list]) => `${t}: ${list.slice(0, 3).map((c) => `${c.person ? c.person + ' ' : ''}${c.form}`).join(', ')}`)
              .join('; ')
          : '—';
        md += `| **${v.infinitive}** | ${v.translation} | ${conjSample} |\n`;
      });
      md += `\n`;
    }

    if (includeGrammar && story.grammarBites && story.grammarBites.length > 0) {
      md += `## 💡 Grammar Focus Notes\n\n`;
      story.grammarBites.forEach((gb, idx) => {
        md += `### ${idx + 1}. ${gb.title}\n${gb.rule}\n\n`;
        gb.examples.forEach((ex) => {
          md += `- *"${ex.target}"* — ${ex.en}\n`;
        });
        if (gb.tip) md += `> **Tip:** ${gb.tip}\n\n`;
      });
    }

    if (includeQuiz && story.quiz && story.quiz.length > 0) {
      md += `## ❓ Comprehension Questions\n\n`;
      story.quiz.forEach((q, idx) => {
        md += `${idx + 1}. **${q.question_target}** (*${q.question_en}*)\n`;
        q.options.forEach((opt, oIdx) => {
          md += `   - [ ] ${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
        });
        md += `\n`;
      });
    }

    if (includeAnswerKey && story.quiz && story.quiz.length > 0) {
      md += `## 🔑 Answer Key\n\n`;
      story.quiz.forEach((q, idx) => {
        md += `${idx + 1}. **${String.fromCharCode(65 + q.correctIndex)}** — ${q.options[q.correctIndex]} (${q.explanation})\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    if (!printAreaRef.current) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${story.title_target} - Study Sheet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; user-select: text; }
    h1 { color: #0f172a; margin-bottom: 4px; }
    h2 { color: #008450; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 28px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: bold; margin-right: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; font-weight: bold; }
    .sentence-block { margin-bottom: 12px; }
    .target-text { font-size: 15px; font-weight: 600; color: #0f172a; }
    .en-text { font-size: 13px; color: #64748b; font-style: italic; }
    .cloze-blank { display: inline-block; border-bottom: 2px dashed #94a3b8; min-width: 80px; height: 16px; margin: 0 4px; }
    @media print { body { max-width: 100%; margin: 20px; } }
  </style>
</head>
<body>
  ${printAreaRef.current.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title_target.toLowerCase().replace(/[^a-z0-9]/g, '_')}_study_sheet.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAnki = () => {
    navigator.clipboard.writeText(ankiExportText);
    setAnkiCopied(true);
    setTimeout(() => setAnkiCopied(false), 2500);
  };

  const handleDownloadAnkiFile = () => {
    const ext = ankiExportFormat === 'tsv' ? 'tsv' : 'csv';
    const blob = new Blob([ankiExportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title_target.toLowerCase().replace(/[^a-z0-9]/g, '_')}_flashcards.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in print:p-0 print:bg-white print:static google-anno-skip no-ads"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up print:max-h-none print:shadow-none print:border-none print:rounded-none select-text"
        style={{ userSelect: 'text' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Hidden during browser print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#fbfcfd] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#008450] flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Printable Study Sheet & PDF Export
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Customize sections, text selection, print worksheets, or export directly to Anki & Quizlet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customizable Options Bar (Hidden during browser print) */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Sections:
            </span>

            {/* 1. Story Text */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeStoryText}
                onChange={(e) => setIncludeStoryText(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Story Text</span>
            </label>

            {/* 2. English Translations */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none" title="Toggle English translations on or off for study or tests">
              <input
                type="checkbox"
                checked={includeTranslations}
                onChange={(e) => setIncludeTranslations(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span className="text-emerald-900 font-semibold">Translations</span>
            </label>

            {/* 3. Sentence Numbers */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none" title="Show or hide numbering 1, 2, 3...">
              <input
                type="checkbox"
                checked={includeSentenceNumbers}
                onChange={(e) => setIncludeSentenceNumbers(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Numbers</span>
            </label>

            {/* 4. Vocabulary Table */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeVocab}
                onChange={(e) => setIncludeVocab(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Vocabulary</span>
            </label>

            {/* 5. Grammar Notes */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeGrammar}
                onChange={(e) => setIncludeGrammar(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Grammar</span>
            </label>

            {/* 6. Fill-in Blanks Cloze */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeClozeWorksheet}
                onChange={(e) => setIncludeClozeWorksheet(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Cloze Blanks</span>
            </label>

            {/* 7. Cloze Word Bank (if Cloze enabled) */}
            {includeClozeWorksheet && (
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600 select-none" title="Show word bank bank box above fill-in-blanks">
                <input
                  type="checkbox"
                  checked={includeClozeWordBank}
                  onChange={(e) => setIncludeClozeWordBank(e.target.checked)}
                  className="accent-[#008450] cursor-pointer"
                />
                <span className="text-blue-900 font-semibold">Word Bank</span>
              </label>
            )}

            {/* 8. Quiz Questions */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeQuiz}
                onChange={(e) => setIncludeQuiz(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Quiz</span>
            </label>

            {/* 9. Answer Key */}
            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                className="accent-[#008450] cursor-pointer"
              />
              <span>Answer Key</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLayoutStyle(layoutStyle === 'interlinear' ? 'columns' : 'interlinear')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-slate-600 transition cursor-pointer"
            >
              Layout: {layoutStyle === 'interlinear' ? '📝 Interlinear' : '⚖️ 2-Columns'}
            </button>
          </div>
        </div>

        {/* Printable Worksheet Area (Fully Selectable Text) */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-100/50 print:p-0 print:bg-white print:overflow-visible select-text" style={{ userSelect: 'text' }}>
          <div
            ref={printAreaRef}
            className="w-full max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 select-text"
            style={{ userSelect: 'text' }}
          >
            {/* Worksheet Header */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 select-text">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {story.title_target}
                  </h1>
                  {includeTranslations && (
                    <h2 className="text-base sm:text-lg text-slate-500 font-medium mt-0.5">
                      {story.title_en}
                    </h2>
                  )}
                </div>
                <div className="text-right text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="font-bold text-slate-400">Name: </span>
                    <span className="inline-block border-b border-slate-400 w-32" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">Date: </span>
                    <span className="inline-block border-b border-slate-400 w-32" />
                  </div>
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  🌐 {targetLang}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  🎯 {difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  ⏳ {tense}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                  {story.sentences.length} sentences
                </span>
              </div>
            </div>

            {/* Section 1: Story Text */}
            {includeStoryText && (
              <section className="mb-8 select-text">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#008450] border-b border-emerald-200 pb-1 mb-4 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Part 1: Reading Text
                </h3>

                {layoutStyle === 'columns' && includeTranslations ? (
                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm select-text">
                    <div className="space-y-3 pr-3 border-r border-slate-200">
                      <span className="font-bold text-[10px] uppercase text-emerald-800 tracking-wider block">
                        {targetLang}
                      </span>
                      {story.sentences.map((s, idx) => (
                        <p key={idx} className="font-serif leading-relaxed text-slate-900 select-text">
                          {includeSentenceNumbers && (
                            <span className="font-sans font-bold text-xs text-slate-400 mr-1.5">{idx + 1}.</span>
                          )}
                          {s.target}
                        </p>
                      ))}
                    </div>
                    <div className="space-y-3 pl-1 select-text">
                      <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider block">
                        English Translation
                      </span>
                      {story.sentences.map((s, idx) => (
                        <p key={idx} className="leading-relaxed text-slate-600 italic select-text">
                          {includeSentenceNumbers && (
                            <span className="font-sans font-bold text-xs text-slate-400 mr-1.5">{idx + 1}.</span>
                          )}
                          {s.en}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 select-text">
                    {story.sentences.map((s, idx) => (
                      <div key={idx} className="space-y-0.5 select-text">
                        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug select-text">
                          {includeSentenceNumbers && (
                            <span className="text-xs font-bold text-emerald-800 mr-2">{idx + 1}.</span>
                          )}
                          {s.target}
                        </p>
                        {includeTranslations && (
                          <p className="text-xs text-slate-500 italic pl-5 select-text">
                            {s.en}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Section 2: Vocabulary Table */}
            {includeVocab && uniqueVerbs.length > 0 && (
              <section className="mb-8 break-inside-avoid select-text">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#008450] border-b border-emerald-200 pb-1 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Part 2: Key Vocabulary & Verbs
                </h3>

                <div className="overflow-x-auto select-text">
                  <table className="w-full text-left text-xs border border-slate-300 select-text">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300">Infinitive / Word</th>
                        <th className="p-2 border-r border-slate-300">{baseLang} Meaning</th>
                        <th className="p-2">Sample Conjugations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {uniqueVerbs.map((v, i) => (
                        <tr key={i} className="hover:bg-slate-50 select-text">
                          <td className="p-2 font-bold text-slate-900 border-r border-slate-300 font-serif select-text">
                            {v.infinitive}
                          </td>
                          <td className="p-2 text-slate-700 border-r border-slate-300 select-text">
                            {v.translation}
                          </td>
                          <td className="p-2 text-slate-600 text-[11px] select-text">
                            {v.conjugations ? (
                              Object.entries(v.conjugations)
                                .map(([t, list]) => `${t}: ${list.slice(0, 3).map((c) => `${c.person ? c.person + ' ' : ''}${c.form}`).join(', ')}`)
                                .join(' | ')
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Section 3: Grammar Focus Notes */}
            {includeGrammar && story.grammarBites && story.grammarBites.length > 0 && (
              <section className="mb-8 break-inside-avoid select-text">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-3 flex items-center gap-1.5">
                  💡 Part 3: Grammar Focus Deep-Dive
                </h3>

                <div className="space-y-3 select-text">
                  {story.grammarBites.map((gb, i) => (
                    <div key={i} className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs space-y-1 select-text">
                      <h4 className="font-bold text-amber-950 text-xs select-text">
                        {i + 1}. {gb.title}
                      </h4>
                      <p className="text-slate-700 leading-relaxed text-[11px] select-text">
                        {gb.rule}
                      </p>
                      {gb.examples && (
                        <div className="pl-3 border-l-2 border-amber-300 space-y-0.5 mt-1 select-text">
                          {gb.examples.map((ex, exI) => (
                            <p key={exI} className="text-[11px] text-slate-800 select-text">
                              <span className="font-semibold italic font-serif">&ldquo;{ex.target}&rdquo;</span> — <span className="text-slate-500">{ex.en}</span>
                            </p>
                          ))}
                        </div>
                      )}
                      {gb.tip && (
                        <p className="text-[10px] text-amber-900 font-medium select-text">
                          <strong>Note:</strong> {gb.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 4: Fill-in Blanks Practice */}
            {includeClozeWorksheet && (
              <section className="mb-8 break-inside-avoid select-text">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#008450] border-b border-emerald-200 pb-1 mb-3 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" /> Part 4: Cloze Practice (Fill in the missing words)
                </h3>

                {/* Optional Word Bank Box */}
                {includeClozeWordBank && clozeWordBank.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl select-text">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-1.5">
                      📦 Word Bank (Select words to fill in the blanks):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {clozeWordBank.map((word, wI) => (
                        <span
                          key={wI}
                          className="px-2.5 py-1 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 shadow-2xs select-text"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 select-text">
                  {story.sentences.map((s, idx) => {
                    const isTargetCh = isChinese(targetLang, s.target) || isChinese(story._meta?.targetLang);
                    let blankDisplay = '';

                    if (isTargetCh) {
                      const segs = segmentChinese(s.target);
                      const wordCandidates = segs
                        .map((seg, sI) => ({ ...seg, sI }))
                        .filter((seg) => seg.isWord && seg.text.length >= 2);
                      const chosenSeg = wordCandidates.length > 0
                        ? wordCandidates[idx % wordCandidates.length]
                        : null;

                      blankDisplay = segs
                        .map((seg, sI) => (chosenSeg && sI === chosenSeg.sI ? '（ _______ ）' : seg.text))
                        .join('');
                    } else {
                      const words = s.target.split(/\s+/);
                      const blankIdx = (idx * 2 + 1) % words.length;
                      blankDisplay = words
                        .map((w, wI) => (wI === blankIdx ? '__________________' : w))
                        .join(' ');
                    }

                    return (
                      <div key={idx} className="text-xs sm:text-sm select-text">
                        <p className="font-semibold text-slate-900 select-text">
                          {includeSentenceNumbers && (
                            <span className="text-slate-400 mr-2 font-bold">{idx + 1}.</span>
                          )}
                          {blankDisplay}
                        </p>
                        {includeClozeHints && (
                          <p className="text-[11px] text-slate-400 italic pl-5 mt-0.5 select-text">
                            Hint: ({s.en})
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 5: Comprehension Quiz Questions */}
            {includeQuiz && story.quiz && story.quiz.length > 0 && (
              <section className="mb-8 break-inside-avoid select-text">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-200 pb-1 mb-3 flex items-center gap-1.5">
                  ❓ Part 5: Reading Comprehension Check
                </h3>

                <div className="space-y-4 select-text">
                  {story.quiz.map((q, idx) => {
                    const chosen = quizTestAnswers[idx];
                    return (
                      <div key={idx} className="text-xs sm:text-sm space-y-1.5 select-text">
                        <p className="font-bold text-slate-900 select-text">
                          {idx + 1}. {q.question_target}{' '}
                          {includeTranslations && (
                            <span className="text-slate-500 font-normal italic">({q.question_en})</span>
                          )}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 text-xs text-slate-700 select-text">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = chosen === oIdx;
                            return (
                              <button
                                type="button"
                                key={oIdx}
                                onClick={() =>
                                  setQuizTestAnswers((prev) => ({
                                    ...prev,
                                    [idx]: prev[idx] === oIdx ? -1 : oIdx,
                                  }))
                                }
                                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition cursor-pointer select-text ${
                                  isSelected
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold ring-1 ring-indigo-400'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className={`inline-block w-4 h-4 border rounded-sm text-center text-[10px] font-bold ${
                                  isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-400 text-slate-600'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="select-text">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 6: Answer Key */}
            {includeAnswerKey && story.quiz && story.quiz.length > 0 && (
              <section className="mt-8 pt-4 border-t-2 border-dashed border-slate-300 break-inside-avoid select-text">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 select-text">
                  🔑 Teacher / Self-Study Answer Key
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 select-text">
                  {story.quiz.map((q, idx) => (
                    <div key={idx} className="select-text">
                      <span className="font-bold select-text">{idx + 1}. ({String.fromCharCode(65 + q.correctIndex)})</span>{' '}
                      <span className="select-text">{q.options[q.correctIndex]}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Modal Action Footer (Hidden during print) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-[#fbfcfd] flex flex-wrap items-center justify-between gap-3 print:hidden select-none">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tip: Select &ldquo;Save as PDF&rdquo; in your browser&apos;s print dialog</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export to Anki & Quizlet Button */}
            <button
              type="button"
              onClick={() => setIsAnkiExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
              title="Export flashcards for Anki, Quizlet, or Memrise"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Export to Anki / Quizlet</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#008450] hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-md active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Anki & Quizlet Export Drawer / Modal */}
        {isAnkiExportOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in google-anno-skip no-ads"
            onClick={() => setIsAnkiExportOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Export Header */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-wide uppercase">
                      Export to Anki & Quizlet
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      Standard Tab-Separated Flashcard Cards
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnkiExportOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Export Controls & Preview */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Content to Include:
                    </label>
                    <select
                      value={ankiExportScope}
                      onChange={(e) => setAnkiExportScope(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="both">All (Vocabulary + Sentences)</option>
                      <option value="vocab">Vocabulary & Verbs only</option>
                      <option value="sentences">Story Sentences only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Card Format:
                    </label>
                    <select
                      value={ankiExportFormat}
                      onChange={(e) => setAnkiExportFormat(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="tsv">TSV (Tab-separated • Anki & Quizlet standard)</option>
                      <option value="csv">CSV (Comma-separated)</option>
                    </select>
                  </div>
                </div>

                {/* Card Preview Box */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-bold text-slate-600">
                      Card Preview ({ankiExportText.split('\n').filter(Boolean).length} cards):
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Front {ankiExportFormat === 'tsv' ? '⇥ [Tab]' : ','} Back
                    </span>
                  </div>
                  <textarea
                    readOnly
                    value={ankiExportText}
                    rows={6}
                    className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl select-text resize-none text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Instructions Box */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs space-y-1.5 text-indigo-950">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>How to import in 10 seconds:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    <strong>In Quizlet:</strong> Click <em>Create study set</em> &rarr; click <em>Import from Word / Excel</em> &rarr; Paste &rarr; Done!
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    <strong>In Anki:</strong> Click <em>Import File</em> &rarr; select the downloaded .tsv file &rarr; Import!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyAnki}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {ankiCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{ankiCopied ? 'Copied to Clipboard!' : 'Copy Cards to Clipboard'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadAnkiFile}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .{ankiExportFormat} File</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

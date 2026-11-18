import fs from 'fs';
import path from 'path';
import {
  EDITORIAL_ARTICLES,
  LANGUAGE_HUBS,
  EditorialArticle,
  LanguageHub,
  getArticleBySlug,
  getArticlesByHub,
  getHubBySlug,
} from './editorialContent';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(
  title: string,
  description: string,
  content: string,
  canonicalUrl: string,
  structuredData?: object | object[],
  ogType: 'website' | 'article' = 'article'
): string {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeCanonical = escapeHtml(canonicalUrl);
  const ldItems = structuredData
    ? (Array.isArray(structuredData) ? structuredData : [structuredData])
    : [];
  const jsonLd = ldItems
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join('\n  ');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="google-adsense-account" content="ca-pub-8750963077643989" />
  <title>${safeTitle} | Querviam</title>
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${safeCanonical}" />
  <meta property="og:site_name" content="Querviam" />
  <meta property="og:title" content="${safeTitle} | Querviam" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${safeCanonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle} | Querviam" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="theme-color" content="#008450" />
  <link rel="icon" type="image/svg+xml" href="/favicons/monogram-q.svg?v=q3" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px 20px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-inner {
      max-width: 1020px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #008450;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: -0.5px;
    }
    .brand-badge {
      font-size: 11px;
      background: #ecfdf5;
      color: #065f46;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
      border: 1px solid #a7f3d0;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 13px;
      font-weight: 600;
      flex-wrap: wrap;
    }
    nav a {
      color: #475569;
      text-decoration: none;
      transition: color 0.15s;
    }
    nav a:hover {
      color: #008450;
    }
    .btn-app {
      background: #008450;
      color: #ffffff !important;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.15s;
    }
    .btn-app:hover {
      background: #00683f;
    }
    main {
      max-width: 900px;
      margin: 32px auto;
      padding: 0 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px 28px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .breadcrumbs {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .breadcrumbs a {
      color: #008450;
      text-decoration: none;
      font-weight: 600;
    }
    .byline {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    h1 {
      font-size: 28px;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 10px;
      line-height: 1.25;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 20px;
      color: #0f172a;
      margin-top: 30px;
      margin-bottom: 12px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }
    h3 {
      font-size: 16px;
      color: #1e293b;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    p, li {
      font-size: 15px;
      color: #334155;
      line-height: 1.7;
    }
    a {
      color: #008450;
    }
    .meta-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      background: #f1f5f9;
      color: #334155;
      margin-right: 6px;
      margin-bottom: 8px;
    }
    .meta-tag-lang {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .meta-tag-level {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .story-sentence {
      padding: 14px 18px;
      background: #f8fafc;
      border-left: 4px solid #008450;
      border-radius: 8px;
      margin-bottom: 14px;
    }
    .sentence-target {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .sentence-en {
      font-size: 14px;
      color: #64748b;
      font-style: italic;
    }
    .callout-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 20px;
      margin: 16px 0;
    }
    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    .mini-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      background: #ffffff;
    }
    .verb-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 13px;
    }
    .verb-table th, .verb-table td {
      border: 1px solid #e2e8f0;
      padding: 9px 12px;
      text-align: left;
      vertical-align: top;
    }
    .verb-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    details.qa-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 10px;
      background: #ffffff;
    }
    details.qa-item summary {
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }
    details.qa-item p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #334155;
    }
    footer {
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 32px 20px 48px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      margin-top: 48px;
    }
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .footer-links a {
      color: #475569;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-links a:hover {
      color: #008450;
    }
  </style>
  ${jsonLd}
</head>
<body>
  <header>
    <div class="header-inner">
      <a href="/" class="brand">
        <span>Querviam</span>
        <span class="brand-badge">Language Immersion</span>
      </a>
      <nav>
        <a href="/stories">Library</a>
        <a href="/learn/italian">Italian</a>
        <a href="/learn/spanish">Spanish</a>
        <a href="/learn/french">French</a>
        <a href="/learn/german">German</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/" class="btn-app">Open Interactive App →</a>
      </nav>
    </div>
  </header>

  <main>
    ${content}
  </main>

  <footer>
    <div class="footer-links">
      <a href="/stories">Reading Library</a>
      <span>•</span>
      <a href="/learn/italian">Italian Hub</a>
      <span>•</span>
      <a href="/learn/spanish">Spanish Hub</a>
      <span>•</span>
      <a href="/learn/french">French Hub</a>
      <span>•</span>
      <a href="/learn/german">German Hub</a>
      <span>•</span>
      <a href="/learn/nordic-slavic">Norwegian & Czech</a>
      <span>•</span>
      <a href="/about">About Us</a>
      <span>•</span>
      <a href="/privacy">Privacy Policy</a>
      <span>•</span>
      <a href="/terms">Terms of Service</a>
      <span>•</span>
      <a href="/contact">Contact</a>
    </div>
    <p style="max-width: 640px; margin: 0 auto 8px;">
      Querviam — Curated bilingual reading lessons, cultural context, and practical grammar guides for language learners worldwide.
    </p>
    <p style="font-size: 11px; color: #94a3b8; margin: 0;">
      © ${new Date().getFullYear()} Querviam • Gordon Robb • All rights reserved.
    </p>
  </footer>
</body>
</html>`;
}

function renderArticleCard(article: EditorialArticle): string {
  return `
    <article style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; background: #ffffff;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
        <span class="meta-tag meta-tag-lang">${escapeHtml(article.language)}</span>
        <span class="meta-tag meta-tag-level">${escapeHtml(article.level)}</span>
        <span class="meta-tag">${escapeHtml(article.category)}</span>
        <span class="meta-tag">${escapeHtml(article.tenseFocus)}</span>
      </div>
      <h3 style="margin: 0 0 4px; font-size: 19px;">
        <a href="/read/${escapeHtml(article.slug)}" style="text-decoration: none; color: #0f172a;">${escapeHtml(article.titleTarget)}</a>
      </h3>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 10px; font-style: italic;">${escapeHtml(article.titleEn)}</p>
      <p style="margin: 0 0 14px; font-size: 14px; color: #334155;">${escapeHtml(article.summary)}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 13px;">
        <span style="color: #64748b;">${article.readingMinutes} min read • Updated ${escapeHtml(article.updatedDate)}</span>
        <a href="/read/${escapeHtml(article.slug)}" style="font-weight: 700; text-decoration: underline;">Read Lesson, Grammar & Vocabulary →</a>
      </div>
    </article>
  `;
}

export function renderStoriesCatalogHtml(_exportsDir: string): string {
  const hubCards = LANGUAGE_HUBS.map((hub) => {
    const count = getArticlesByHub(hub.slug).length;
    return `
      <div class="mini-card">
        <div style="font-size: 12px; font-weight: 700; color: #008450; text-transform: uppercase; margin-bottom: 4px;">
          ${count} Curated Lessons
        </div>
        <h3 style="margin: 0 0 6px; font-size: 17px;">
          <a href="/learn/${escapeHtml(hub.slug)}" style="text-decoration: none; color: #0f172a;">${escapeHtml(hub.language)} Hub →</a>
        </h3>
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          ${escapeHtml(hub.metaDescription)}
        </p>
      </div>
    `;
  }).join('');

  const groupedSections = LANGUAGE_HUBS.map((hub) => {
    const articles = getArticlesByHub(hub.slug);
    return `
      <h2>
        <a href="/learn/${escapeHtml(hub.slug)}" style="text-decoration: none; color: #0f172a;">${escapeHtml(hub.language)} Reading &amp; Grammar Lessons</a>
      </h2>
      ${articles.map(renderArticleCard).join('')}
    `;
  }).join('');

  const content = `
    <div class="card">
      <h1>Querviam Bilingual Reading Library</h1>
      <p style="font-size: 16px; color: #475569; margin-bottom: 18px;">
        Explore our growing editorial library of CEFR-graded stories, everyday dialogues, cultural essays, and targeted grammar guides across Italian, Spanish, French, German, Norwegian, and Czech. Each lesson pairs natural target-language passages with aligned English phrasing, regional context, essential vocabulary tables, and self-check comprehension questions.
      </p>

      <h2>Browse by Language Track</h2>
      <div class="grid-cards">
        ${hubCards}
      </div>

      ${groupedSections}

      <div class="callout-box" style="margin-top: 28px;">
        <h2 style="margin-top: 0;">How to Get the Most Out of Bilingual Reading</h2>
        <p>
          Language acquisition research shows that vocabulary and grammar settle fastest when encountered inside coherent, meaningful stories slightly above your current comfort level. We recommend reading each lesson in three passes: first skim the target-language sentences using the English line only where needed; second study the Grammar Spotlight and Vocabulary table; and third open the interactive reader to practice listening aloud and speaking sentences with real-time pronunciation feedback.
        </p>
        <div style="margin-top: 14px;">
          <a href="/" class="btn-app" style="display: inline-block;">Launch Interactive Immersion App →</a>
        </div>
      </div>
    </div>
  `;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Querviam Bilingual Reading Library',
    description:
      'Curated collection of CEFR-graded bilingual stories, dialogues, and grammar guides across Italian, Spanish, French, German, Norwegian, and Czech.',
    url: 'https://querviam.com/stories',
  };

  return layout(
    'Bilingual Reading Library & Language Lessons',
    'Browse CEFR-graded bilingual stories, dialogues, cultural guides, and grammar lessons in Italian, Spanish, French, German, Norwegian, and Czech.',
    content,
    'https://querviam.com/stories',
    structuredData,
    'website'
  );
}

export function renderLanguageHubHtml(hubSlug: string): string | null {
  const hub: LanguageHub | undefined = getHubBySlug(hubSlug);
  if (!hub) return null;

  const articles = getArticlesByHub(hubSlug);
  const siblingHubs = LANGUAGE_HUBS.filter((h) => h.slug !== hubSlug);

  const tipsHtml = hub.studyTips
    .map(
      (tip) => `
      <div class="mini-card">
        <h3 style="margin-top: 0; color: #065f46; font-size: 15px;">${escapeHtml(tip.title)}</h3>
        <p style="margin: 0; font-size: 14px; color: #334155;">${escapeHtml(tip.detail)}</p>
      </div>
    `
    )
    .join('');

  const roadmapRows = hub.cefrRoadmap
    .map(
      (row) => `
      <tr>
        <td><strong>${escapeHtml(row.level)}</strong></td>
        <td>${escapeHtml(row.milestone)}</td>
      </tr>
    `
    )
    .join('');

  const content = `
    <div class="card">
      <div class="breadcrumbs">
        <a href="/stories">Reading Library</a>
        <span>/</span>
        <span>${escapeHtml(hub.language)}</span>
      </div>

      <h1>${escapeHtml(hub.headline)}</h1>
      <div class="byline">
        Curated by <strong>Gordon Robb</strong> • Last updated ${escapeHtml(hub.updatedDate)} • ${articles.length} Complete Lessons
      </div>

      ${hub.introParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}

      <h2>Key Study Principles for ${escapeHtml(hub.language)}</h2>
      <div class="grid-cards">
        ${tipsHtml}
      </div>

      <h2>CEFR Proficiency Roadmap</h2>
      <table class="verb-table">
        <thead>
          <tr>
            <th>Proficiency Band</th>
            <th>Core Communication Milestones</th>
          </tr>
        </thead>
        <tbody>
          ${roadmapRows}
        </tbody>
      </table>

      <h2>Curated ${escapeHtml(hub.language)} Lessons &amp; Grammar Guides</h2>
      ${articles.map(renderArticleCard).join('')}

      <h2>Explore Other Language Tracks</h2>
      <div class="footer-links" style="justify-content: flex-start; margin-top: 10px;">
        ${siblingHubs
          .map(
            (s) =>
              `<a href="/learn/${escapeHtml(s.slug)}" class="meta-tag meta-tag-lang" style="text-decoration: none;">${escapeHtml(s.language)} →</a>`
          )
          .join('')}
      </div>

      <div style="margin-top: 28px; padding: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; text-align: center;">
        <h3 style="margin-top: 0; color: #065f46;">Practice ${escapeHtml(hub.language)} Interactively</h3>
        <p style="font-size: 14px; color: #047857; margin-bottom: 16px;">
          Listen to native speech audio, test yourself with fill-in-the-blank and word-scramble exercises, and receive word-level pronunciation scoring.
        </p>
        <a href="/" class="btn-app" style="display: inline-block;">Open Interactive App →</a>
      </div>
    </div>
  `;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.headline,
    description: hub.metaDescription,
    url: `https://querviam.com/learn/${hub.slug}`,
    inLanguage: hub.language,
  };

  return layout(
    hub.headline,
    hub.metaDescription,
    content,
    `https://querviam.com/learn/${hub.slug}`,
    structuredData,
    'website'
  );
}

export function renderStoryArticleHtml(slug: string, exportsDir: string): string | null {
  const editorial = getArticleBySlug(slug);
  const filePath = path.join(exportsDir, `${slug}.json`);
  const hasJson = fs.existsSync(filePath);

  if (!editorial && !hasJson) {
    return null;
  }

  try {
    const jsonData = hasJson ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : null;
    const meta = jsonData?._meta || {};

    const titleTarget = editorial?.titleTarget || jsonData?.title_target || 'Untitled Story';
    const titleEn = editorial?.titleEn || jsonData?.title_en || '';
    const targetLang = editorial?.language || meta.targetLang || 'Target Language';
    const difficulty = editorial?.level || meta.difficulty || 'Intermediate';
    const tense = editorial?.tenseFocus || meta.tense || 'Natural Tenses';
    const hubSlug = editorial?.hubSlug || 'italian';
    const publishedDate = editorial?.publishedDate || '2026-09-14';
    const updatedDate = editorial?.updatedDate || '2026-11-12';
    const readingMinutes = editorial?.readingMinutes || 5;

    const rawSentences: any[] =
      (editorial?.sentences && editorial.sentences.length > 0 ? editorial.sentences : null) ||
      (Array.isArray(jsonData?.sentences) ? jsonData.sentences : []);

    const sentenceBlocks = rawSentences
      .map((s: any, idx: number) => {
        let verbConjugationsHtml = '';
        if (Array.isArray(s.verbs) && s.verbs.length > 0) {
          const verbRows = s.verbs
            .map((v: any) => {
              const conj = v.conjugations?.present || [];
              const conjText = Array.isArray(conj)
                ? conj.map((c: any) => `${escapeHtml(c.person)}: <strong>${escapeHtml(c.form)}</strong>`).join(', ')
                : '';
              return `<tr>
                <td><strong>${escapeHtml(v.infinitive)}</strong> (${escapeHtml(v.translation)})</td>
                <td>${conjText || 'Contextual usage'}</td>
              </tr>`;
            })
            .join('');

          verbConjugationsHtml = `
            <details style="margin-top: 8px; font-size: 13px;">
              <summary style="cursor: pointer; color: #008450; font-weight: 600;">Verb &amp; Conjugation Notes (${s.verbs.length})</summary>
              <table class="verb-table" style="margin-top: 8px;">
                <thead>
                  <tr>
                    <th>Infinitive</th>
                    <th>Key Forms</th>
                  </tr>
                </thead>
                <tbody>${verbRows}</tbody>
              </table>
            </details>
          `;
        }

        return `
          <div class="story-sentence">
            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Sentence ${idx + 1}</div>
            <div class="sentence-target">${escapeHtml(s.target)}</div>
            <div class="sentence-en">${escapeHtml(s.en)}</div>
            ${verbConjugationsHtml}
          </div>
        `;
      })
      .join('');

    const culturalSection = editorial
      ? `
        <h2>Cultural &amp; Regional Context</h2>
        ${editorial.culturalContext.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      `
      : '';

    const grammarSection = editorial
      ? `
        <h2>Grammar Spotlight: ${escapeHtml(editorial.grammarSpotlightTitle)}</h2>
        ${editorial.grammarSpotlightParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        <table class="verb-table">
          <thead>
            <tr>
              <th>Target Phrase / Pattern</th>
              <th>Linguistic Note</th>
            </tr>
          </thead>
          <tbody>
            ${editorial.grammarExamples
              .map(
                (ex) => `
                <tr>
                  <td><strong>${escapeHtml(ex.form)}</strong></td>
                  <td>${escapeHtml(ex.explanation)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      `
      : '';

    const vocabSection =
      editorial && editorial.vocabulary.length > 0
        ? `
        <h2>Essential Vocabulary &amp; Usage Notes</h2>
        <table class="verb-table">
          <thead>
            <tr>
              <th>Expression</th>
              <th>Part of Speech</th>
              <th>Meaning</th>
              <th>Usage Note</th>
            </tr>
          </thead>
          <tbody>
            ${editorial.vocabulary
              .map(
                (v) => `
                <tr>
                  <td><strong>${escapeHtml(v.term)}</strong></td>
                  <td>${escapeHtml(v.pos)}</td>
                  <td>${escapeHtml(v.meaning)}</td>
                  <td>${escapeHtml(v.usageNote)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      `
        : '';

    const quizSection =
      editorial && editorial.comprehensionCheck.length > 0
        ? `
        <h2>Comprehension &amp; Self-Check Questions</h2>
        <p style="font-size: 14px; color: #64748b;">Test your understanding before revealing each explanation:</p>
        ${editorial.comprehensionCheck
          .map(
            (q) => `
            <details class="qa-item">
              <summary>${escapeHtml(q.question)}</summary>
              <p>${escapeHtml(q.answer)}</p>
            </details>`
          )
          .join('')}
      `
        : '';

    const related = EDITORIAL_ARTICLES.filter((a) => a.slug !== slug && a.hubSlug === hubSlug).slice(0, 3);
    const relatedHtml =
      related.length > 0
        ? `
        <h2>Continue Learning ${escapeHtml(targetLang)}</h2>
        <div class="grid-cards">
          ${related
            .map(
              (r) => `
              <div class="mini-card">
                <div class="meta-tag meta-tag-level">${escapeHtml(r.level)}</div>
                <h3 style="margin: 4px 0; font-size: 15px;">
                  <a href="/read/${escapeHtml(r.slug)}" style="text-decoration: none; color: #0f172a;">${escapeHtml(r.titleTarget)}</a>
                </h3>
                <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">${escapeHtml(r.titleEn)}</p>
                <a href="/read/${escapeHtml(r.slug)}" style="font-size: 13px; font-weight: 700;">Read Lesson →</a>
              </div>`
            )
            .join('')}
        </div>
      `
        : '';

    const content = `
      <div class="card">
        <div class="breadcrumbs">
          <a href="/stories">Reading Library</a>
          <span>/</span>
          <a href="/learn/${escapeHtml(hubSlug)}">${escapeHtml(targetLang)}</a>
          <span>/</span>
          <span>${escapeHtml(titleEn || titleTarget)}</span>
        </div>

        <div style="margin-bottom: 12px;">
          <span class="meta-tag meta-tag-lang">${escapeHtml(targetLang)}</span>
          <span class="meta-tag meta-tag-level">${escapeHtml(difficulty)}</span>
          <span class="meta-tag">${escapeHtml(tense)}</span>
          <span class="meta-tag">${rawSentences.length} sentences</span>
          <span class="meta-tag">${readingMinutes} min study</span>
        </div>

        <h1>${escapeHtml(titleTarget)}</h1>
        <p style="font-size: 18px; color: #64748b; font-style: italic; margin-top: -4px; margin-bottom: 12px;">${escapeHtml(titleEn)}</p>

        <div class="byline">
          By <strong>Gordon Robb</strong> • Published ${escapeHtml(publishedDate)} • Updated ${escapeHtml(updatedDate)}
        </div>

        ${editorial ? `<p style="font-size: 15px; color: #334155;">${escapeHtml(editorial.summary)}</p>` : ''}

        ${culturalSection}

        <h2>Bilingual Reading Passage</h2>
        <div style="margin-top: 14px;">
          ${sentenceBlocks}
        </div>

        ${grammarSection}
        ${vocabSection}
        ${quizSection}
        ${relatedHtml}

        <div style="margin-top: 32px; padding: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; text-align: center;">
          <h3 style="margin-top: 0; color: #065f46;">Practice This Lesson with Native Audio</h3>
          <p style="font-size: 14px; color: #047857; margin-bottom: 16px;">
            Open the interactive reader to hear native pronunciation sentence by sentence, inspect every word in the story dictionary, and score your spoken pronunciation.
          </p>
          <a href="/" class="btn-app" style="display: inline-block;">Launch Interactive App →</a>
        </div>
      </div>
    `;

    const structuredData: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${titleTarget} - ${titleEn}`,
        description:
          editorial?.summary ||
          `Bilingual ${targetLang} language lesson (${difficulty}) with sentence-by-sentence translations and grammatical breakdown.`,
        inLanguage: targetLang,
        educationalLevel: difficulty,
        datePublished: publishedDate,
        dateModified: updatedDate,
        author: {
          '@type': 'Person',
          name: 'Gordon Robb',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Querviam',
          url: 'https://querviam.com',
        },
      },
    ];

    if (editorial && editorial.comprehensionCheck.length > 0) {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: editorial.comprehensionCheck.map((qa) => ({
          '@type': 'Question',
          name: qa.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: qa.answer,
          },
        })),
      });
    }

    return layout(
      `${titleTarget} (${targetLang} ${difficulty})`,
      editorial?.summary ||
        `Learn ${targetLang} with '${titleTarget}' (${titleEn}). Complete bilingual text with grammar annotations and vocabulary.`,
      content,
      `https://querviam.com/read/${slug}`,
      structuredData,
      'article'
    );
  } catch (err) {
    console.error('Error rendering article:', err);
    return null;
  }
}

export function renderPrivacyPolicyHtml(): string {
  const content = `
    <div class="card">
      <h1>Privacy Policy</h1>
      <p style="font-size: 14px; color: #64748b; margin-top: -6px; margin-bottom: 24px;">
        Last Updated: November 2026 • Official Publisher Disclosure
      </p>

      <h2>1. Overview and Commitment to Privacy</h2>
      <p>
        Querviam ("we", "us", or "our"), operated by Gordon Robb at <strong>querviam.com</strong>, provides an interactive language immersion web application and curated reading library. We are committed to transparency and respecting the privacy of our learners.
      </p>

      <h2>2. Client-First Data Architecture</h2>
      <p>
        Querviam is engineered with a private, client-first architecture. Stories generated by users, vocabulary bookmarks, practice progress, and speech assessment results are stored <strong>locally in your browser's LocalStorage and IndexedDB</strong>. We do not store, catalog, or share your personal generated language stories in any central database.
      </p>

      <h2>3. Google AdSense &amp; Third-Party Advertising Cookies</h2>
      <p>
        To keep Querviam freely accessible to language learners worldwide, we partner with <strong>Google AdSense</strong> to display non-intrusive advertisements on content screens.
      </p>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites on the internet.</li>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Querviam and/or other sites on the Internet.</li>
        <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
      </ul>

      <h2>4. European Union GDPR Compliance</h2>
      <p>
        If you are a resident of the European Economic Area (EEA), the United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, or erase any personal data held about you. Because Querviam does not maintain user account registries or server-side learner profiles, you retain complete control over your data by clearing your browser cache and cookies at any time.
      </p>

      <h2>5. California Consumer Privacy Act (CCPA)</h2>
      <p>
        Under the CCPA, California residents have the right to know what personal information is collected, request its deletion, and opt out of the sale or sharing of personal data. Querviam does not sell personal information to third parties.
      </p>

      <h2>6. Children's Privacy (COPPA)</h2>
      <p>
        Querviam is designed as a general-audience educational platform. We do not knowingly collect personal identifiable information from children under the age of 13.
      </p>

      <h2>7. Microphone &amp; Audio Processing</h2>
      <p>
        When you use the speech practice feature, audio recorded by your microphone is processed temporarily in memory to assess pronunciation accuracy. Your voice recordings are not retained, stored on servers, or used for machine learning training.
      </p>

      <h2>8. Contact the Publisher</h2>
      <p>
        If you have questions about this Privacy Policy, our advertising practices, or wish to exercise your privacy rights, please contact:
      </p>
      <p>
        <strong>Publisher:</strong> Gordon Robb<br />
        <strong>Website:</strong> <a href="https://querviam.com">https://querviam.com</a><br />
        <strong>Email:</strong> <a href="mailto:support@querviam.com">support@querviam.com</a>
      </p>
    </div>
  `;

  return layout(
    'Privacy Policy',
    'Official Privacy Policy for Querviam: Learn about our client-first data privacy, Google AdSense cookie disclosures, and GDPR/CCPA rights.',
    content,
    'https://querviam.com/privacy',
    undefined,
    'website'
  );
}

export function renderTermsHtml(): string {
  const content = `
    <div class="card">
      <h1>Terms of Service</h1>
      <p style="font-size: 14px; color: #64748b; margin-top: -6px; margin-bottom: 24px;">
        Last Updated: November 2026
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Querviam (querviam.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h2>2. Educational Use and AI-Generated Content</h2>
      <p>
        Querviam combines curated editorial lessons with interactive language tools to support bilingual reading, conversational practice, and grammatical annotations. While we continually strive for pedagogical accuracy, generated content may occasionally contain idiomatic variations. All materials are provided for personal educational immersion.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        The software platform, editorial essays, visual design, brand assets, and proprietary layout of Querviam are protected by applicable copyright and trademark law. Stories and exercises generated by learners for their private study remain the property of the learner.
      </p>

      <h2>4. Prohibited Uses</h2>
      <p>
        You agree not to use the service to generate harmful, unlawful, or abusive content, reverse-engineer the underlying API infrastructure, or overwhelm our servers with automated scrapers or rate-limit violations.
      </p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>
        Querviam is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
      </p>

      <h2>6. Governing Law &amp; Contact</h2>
      <p>
        For inquiries regarding these terms, please contact us at <a href="mailto:support@querviam.com">support@querviam.com</a>.
      </p>
    </div>
  `;

  return layout(
    'Terms of Service',
    'Terms of Service governing the use of Querviam educational language immersion platform.',
    content,
    'https://querviam.com/terms',
    undefined,
    'website'
  );
}

export function renderAboutHtml(): string {
  const content = `
    <div class="card">
      <h1>About Querviam</h1>
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        Empowering language learners worldwide through comprehensible input, curated cultural storytelling, and native-cadence pronunciation practice.
      </p>

      <h2>Our Mission</h2>
      <p>
        Traditional language instruction frequently bogs students down with dry grammatical charts and disjointed vocabulary lists. At Querviam, we believe true linguistic fluency grows through <strong>immersion in compelling, meaningful stories</strong> rooted in real places and everyday life.
      </p>

      <h2>The Pedagogical Framework</h2>
      <p>
        Querviam is built upon the principles of <strong>Stephen Krashen's Comprehensible Input Hypothesis</strong>. Learners acquire grammar and vocabulary naturally when exposed to content that sits just slightly beyond their current competence (i + 1), framed inside memorable narratives:
      </p>
      <ul>
        <li><strong>CEFR Level Grading:</strong> Every lesson is calibrated to Common European Framework of Reference (CEFR) levels ranging from Beginner (A1-A2) through Upper Intermediate (B2+).</li>
        <li><strong>Dual-Line Synchronized Reading:</strong> Target-language sentences are paired cleanly with English translations so learners keep reading momentum instead of breaking focus every five seconds.</li>
        <li><strong>Focused Grammar Spotlights:</strong> Rather than abstract rules in a vacuum, each article explains one real grammatical contrast (such as passato prossimo vs. imperfetto, ser vs. estar, or German V2 inversion) using the exact sentences just read.</li>
        <li><strong>Phonemic Pronunciation Scoring &amp; Interactive Drills:</strong> Learners can listen to native speech synthesis, speak sentences aloud for word-level feedback, and reinforce recall with flashcards and comprehension checks.</li>
      </ul>

      <h2>Publisher &amp; Editorial Standards</h2>
      <p>
        Querviam was founded and is actively edited by <strong>Gordon Robb</strong>. Our public <a href="/stories">Reading Library</a> and five language hubs (<a href="/learn/italian">Italian</a>, <a href="/learn/spanish">Spanish</a>, <a href="/learn/french">French</a>, <a href="/learn/german">German</a>, and <a href="/learn/nordic-slavic">Norwegian &amp; Czech</a>) are continually expanded with cultural context, regional idioms, and practical self-check quizzes.
      </p>

      <h2>Contact Us</h2>
      <p>
        We welcome feedback from educators, students, and linguists. Reach out via <a href="/contact">our Contact Page</a> or email <a href="mailto:support@querviam.com">support@querviam.com</a>.
      </p>
    </div>
  `;

  return layout(
    'About Querviam - Mission & Educational Methodology',
    'Learn about Querviam: Our pedagogical methodology based on Comprehensible Input, CEFR proficiency levels, and editorial standards.',
    content,
    'https://querviam.com/about',
    undefined,
    'website'
  );
}

export function renderContactHtml(): string {
  const content = `
    <div class="card">
      <h1>Contact &amp; Support</h1>
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        We are here to assist with learning inquiries, technical support, editorial feedback, and publisher verification.
      </p>

      <h2>Publisher Contact Information</h2>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px;"><strong>Platform:</strong> Querviam (querviam.com)</p>
        <p style="margin: 0 0 8px;"><strong>Publisher &amp; Editor:</strong> Gordon Robb</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:support@querviam.com" style="font-weight: 700;">support@querviam.com</a></p>
        <p style="margin: 0;"><strong>Response Time:</strong> We endeavor to respond to all student and publisher inquiries within 24 to 48 business hours.</p>
      </div>

      <h2>How to Reach Us</h2>
      <ul>
        <li><strong>Student Support:</strong> Assistance using the audio player, microphone pronunciation scoring, story dictionary, or offline PWA capabilities.</li>
        <li><strong>Editorial Feedback:</strong> Suggestions for new story topics, cultural notes, or grammar guides in any of our supported languages.</li>
        <li><strong>Commercial &amp; Advertising:</strong> Advertising inquiries, Google AdSense publisher verification, or institutional educational licensing.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <h3>Is Querviam completely free?</h3>
      <p>Yes. All curated reading lessons, language hubs, interactive conversation modes, and speech practice features are free to learners.</p>

      <h3>How is my privacy protected?</h3>
      <p>Personal story generation and study progress remain private on your device in browser LocalStorage. Consult our <a href="/privacy">Privacy Policy</a> for full details.</p>
    </div>
  `;

  return layout(
    'Contact & Publisher Support',
    'Get in touch with Querviam for student support, publisher verification, educational feedback, or technical assistance.',
    content,
    'https://querviam.com/contact',
    undefined,
    'website'
  );
}

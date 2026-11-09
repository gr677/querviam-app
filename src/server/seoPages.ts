import fs from 'fs';
import path from 'path';

function layout(title: string, description: string, content: string, canonicalUrl: string, structuredData?: object): string {
  const jsonLd = structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Querviam</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${title} | Querviam" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="theme-color" content="#008450" />
  <link rel="icon" type="image/svg+xml" href="/favicons/monogram-q.svg?v=q3" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      line-height: 1.6;
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
      max-width: 960px;
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
      border-radius: 999px;
      font-weight: 700;
      border: 1px solid #a7f3d0;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 16px;
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
      transition: background 0.15s;
    }
    .btn-app:hover {
      background: #00683f;
    }
    main {
      max-width: 860px;
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
    h1 {
      font-size: 28px;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 1.25;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 20px;
      color: #0f172a;
      margin-top: 28px;
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
      line-height: 1.65;
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
    .verb-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 13px;
    }
    .verb-table th, .verb-table td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
    }
    .verb-table th {
      background: #f1f5f9;
      font-weight: 700;
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
      gap: 18px;
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
        <a href="/stories">Reading Library</a>
        <a href="/about">About Us</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms</a>
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
      <a href="/about">About Us</a>
      <span>•</span>
      <a href="/privacy">Privacy Policy</a>
      <span>•</span>
      <a href="/terms">Terms of Service</a>
      <span>•</span>
      <a href="/contact">Contact & Publisher</a>
    </div>
    <p style="max-width: 600px; margin: 0 auto 8px;">
      Querviam — Master languages through AI stories, real-time conversation, native pronunciation scoring, and grammar deep-dives.
    </p>
    <p style="font-size: 11px; color: #94a3b8; margin: 0;">
      © ${new Date().getFullYear()} Querviam • Gordon Robb • All rights reserved.
    </p>
  </footer>
</body>
</html>`;
}

export function renderStoriesCatalogHtml(exportsDir: string): string {
  const samples = [
    {
      slug: 'a_walk_around_lago_sirio',
      file: 'a_walk_around_lago_sirio.json',
      title: 'Una passeggiata attorno al Lago Sirio',
      titleEn: 'A Walk Around Lake Sirio',
      lang: 'Italian',
      difficulty: 'Intermediate (B1-B2)',
      tense: 'Natural / Mixed',
      summary: 'A reflective walk around the scenic Lake Sirio in Ivrea, exploring descriptive Italian nature terminology and past tenses.',
    },
    {
      slug: 'dialogo_al_caffe_roma',
      file: 'dialogo_al_caffe_roma.json',
      title: 'Dialogo al Caffè Roma',
      titleEn: 'Dialogue at Caffè Roma',
      lang: 'Italian',
      difficulty: 'Beginner (A2-B1)',
      tense: 'Present & Polite Imperative',
      summary: 'Authentic conversational Italian at a bustling Roman cafe: ordering espresso, discussing pastries, and paying the bill.',
    },
    {
      slug: 'el_mercado_de_valencia',
      file: 'el_mercado_de_valencia.json',
      title: 'El mercado de Valencia',
      titleEn: 'The Market of Valencia',
      lang: 'Spanish',
      difficulty: 'Intermediate (B1)',
      tense: 'Present & Narrative Past',
      summary: 'A vivid sensory journey through the Mercado Central in Valencia, highlighting Spanish gastronomy and local culture.',
    },
    {
      slug: 'en_morgentur_i_oslo',
      file: 'en_morgentur_i_oslo.json',
      title: 'En morgentur i Oslo',
      titleEn: 'A Morning Walk in Oslo',
      lang: 'Norwegian',
      difficulty: 'Beginner (A2)',
      tense: 'Present Tense',
      summary: 'Explore early morning Oslo from the Opera House to the fjord, focusing on Norwegian daily vocabulary and natural syntax.',
    },
    {
      slug: 'prochazka_po_karlove_moste',
      file: 'prochazka_po_karlove_moste.json',
      title: 'Procházka po Karlově mostě',
      titleEn: 'A Walk on Charles Bridge',
      lang: 'Czech',
      difficulty: 'Intermediate (B1)',
      tense: 'Past & Present Narrative',
      summary: 'A historical and atmospheric walk across Prague\'s iconic 14th-century Charles Bridge with Czech grammatical declensions.',
    },
  ];

  const storyCards = samples.map(s => `
    <article style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; background: #ffffff;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
        <span class="meta-tag meta-tag-lang">${s.lang}</span>
        <span class="meta-tag meta-tag-level">${s.difficulty}</span>
        <span class="meta-tag">${s.tense}</span>
      </div>
      <h2 style="margin: 0 0 4px; font-size: 20px; border-bottom: none; padding-bottom: 0;">
        <a href="/read/${s.slug}" style="text-decoration: none; color: #0f172a;">${s.title}</a>
      </h2>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 10px; font-style: italic;">${s.titleEn}</p>
      <p style="margin: 0 0 16px; font-size: 14px; color: #334155;">${s.summary}</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <a href="/read/${s.slug}" style="font-weight: 700; font-size: 14px; text-decoration: underline;">Read Bilingual Story & Grammar →</a>
      </div>
    </article>
  `).join('');

  const content = `
    <div class="card">
      <h1>Querviam Bilingual Reading Library</h1>
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        Explore our curated language immersion library. Each lesson presents authentic literature and cultural narratives with sentence-by-sentence translations, CEFR levels, and grammatical conjugations designed for natural second-language acquisition.
      </p>

      <h2>Featured Reading Lessons</h2>
      ${storyCards}

      <div style="margin-top: 32px; padding: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; text-align: center;">
        <h3 style="margin-top: 0; color: #065f46;">Practice Interactively with Real-Time Audio</h3>
        <p style="font-size: 14px; color: #047857; margin-bottom: 16px;">
          Practice any of these stories with native speech audio, word-level phonetic accuracy scoring, and dynamic fill-in-the-blank comprehension challenges in our interactive web application.
        </p>
        <a href="/" class="btn-app" style="display: inline-block;">Launch Interactive Immersion App →</a>
      </div>
    </div>
  `;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Querviam Bilingual Reading Library",
    "description": "Curated collection of CEFR-graded bilingual stories in Italian, Spanish, Norwegian, and Czech with grammatical annotations.",
    "url": "https://querviam.com/stories",
  };

  return layout(
    'Bilingual Reading Library & Language Lessons',
    'Curated collection of CEFR-graded bilingual stories in Italian, Spanish, Norwegian, and Czech with sentence-by-sentence translations and grammatical analysis.',
    content,
    'https://querviam.com/stories',
    structuredData
  );
}

export function renderStoryArticleHtml(slug: string, exportsDir: string): string | null {
  const filePath = path.join(exportsDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const meta = data._meta || {};
    const titleTarget = data.title_target || 'Untitled Story';
    const titleEn = data.title_en || '';
    const targetLang = meta.targetLang || 'Target Language';
    const difficulty = meta.difficulty || 'Intermediate';
    const tense = meta.tense || 'Natural Tenses';
    const sentences = Array.isArray(data.sentences) ? data.sentences : [];

    const sentenceBlocks = sentences.map((s: any, idx: number) => {
      let verbConjugationsHtml = '';
      if (Array.isArray(s.verbs) && s.verbs.length > 0) {
        const verbRows = s.verbs.map((v: any) => {
          const conj = v.conjugations?.present || [];
          const conjText = Array.isArray(conj)
            ? conj.map((c: any) => `${c.person}: <strong>${c.form}</strong>`).join(', ')
            : '';
          return `<tr>
            <td><strong>${v.infinitive}</strong> (${v.translation})</td>
            <td>${conjText || 'Standard conjugation'}</td>
          </tr>`;
        }).join('');

        verbConjugationsHtml = `
          <details style="margin-top: 8px; font-size: 13px;">
            <summary style="cursor: pointer; color: #008450; font-weight: 600;">Grammar & Verb Analysis (${s.verbs.length})</summary>
            <table class="verb-table" style="margin-top: 8px;">
              <thead>
                <tr>
                  <th>Infinitive</th>
                  <th>Key Conjugations</th>
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
          <div class="sentence-target">${s.target}</div>
          <div class="sentence-en">${s.en}</div>
          ${verbConjugationsHtml}
        </div>
      `;
    }).join('');

    const content = `
      <div class="card">
        <div style="margin-bottom: 12px;">
          <a href="/stories" style="font-size: 13px; font-weight: 600; text-decoration: none;">← Back to Reading Library</a>
        </div>
        <div style="margin-bottom: 14px;">
          <span class="meta-tag meta-tag-lang">${targetLang}</span>
          <span class="meta-tag meta-tag-level">${difficulty}</span>
          <span class="meta-tag">${tense}</span>
          <span class="meta-tag">${sentences.length} sentences</span>
        </div>
        <h1>${titleTarget}</h1>
        <p style="font-size: 18px; color: #64748b; font-style: italic; margin-top: -6px; margin-bottom: 24px;">${titleEn}</p>

        <h2>Bilingual Text & Sentence Breakdown</h2>
        <div style="margin-top: 16px;">
          ${sentenceBlocks}
        </div>

        <h2>Educational Commentary & Methodology</h2>
        <p>
          This lesson utilizes dual-line bilingual pairing to eliminate dictionary interruption while reading in <strong>${targetLang}</strong>. As researched in second-language acquisition, seeing the target grammatical structure directly aligned with its contextual English equivalent helps cement inflection patterns and syntax without breaking reading flow.
        </p>

        <div style="margin-top: 32px; padding: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; text-align: center;">
          <h3 style="margin-top: 0; color: #065f46;">Practice This Lesson in Querviam</h3>
          <p style="font-size: 14px; color: #047857; margin-bottom: 16px;">
            Listen to native pronunciations, record your voice for phonetic scoring, and test your recall with interactive study sheets.
          </p>
          <a href="/" class="btn-app" style="display: inline-block;">Launch Interactive App →</a>
        </div>
      </div>
    `;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${titleTarget} - ${titleEn}`,
      "description": `Bilingual ${targetLang} language lesson (${difficulty}) with sentence-by-sentence translations and grammatical breakdown.`,
      "inLanguage": targetLang,
      "educationalLevel": difficulty,
      "publisher": {
        "@type": "Organization",
        "name": "Querviam",
        "url": "https://querviam.com"
      }
    };

    return layout(
      `${titleTarget} (${targetLang} ${difficulty})`,
      `Learn ${targetLang} with '${titleTarget}' (${titleEn}). Complete bilingual text with grammar annotations and vocabulary.`,
      content,
      `https://querviam.com/read/${slug}`,
      structuredData
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
        Querviam ("we", "us", or "our"), operated by Gordon Robb at <strong>querviam.com</strong>, provides an interactive language immersion web application. We are committed to transparency and respecting the privacy of our learners.
      </p>

      <h2>2. Client-First Data Architecture</h2>
      <p>
        Querviam is engineered with a private, client-first architecture. Stories generated by users, vocabulary bookmarks, practice progress, and speech assessment results are stored <strong>locally in your browser's LocalStorage and IndexedDB</strong>. We do not store, catalog, or share your generated language stories in any central database.
      </p>

      <h2>3. Google AdSense & Third-Party Advertising Cookies</h2>
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

      <h2>7. Microphone & Audio Processing</h2>
      <p>
        When you use the speech practice feature, audio recorded by your microphone is processed temporarily in memory to assess pronunciation accuracy. Your voice recordings are not retained, recorded, or used for machine learning training.
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
    'https://querviam.com/privacy'
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
        Querviam utilizes artificial intelligence models to generate bilingual reading passages, conversational practice prompts, and grammatical annotations. While we continually strive for pedagogical accuracy, AI-generated content may occasionally contain idiomatic variations or minor grammatical anomalies. All materials are provided for personal educational immersion.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        The software platform, visual design, brand assets, and proprietary layout of Querviam are protected by applicable copyright and trademark law. Stories and exercises generated by learners for their private study remain the property of the learner.
      </p>

      <h2>4. Prohibited Uses</h2>
      <p>
        You agree not to use the service to generate harmful, unlawful, or abusive content, reverse-engineer the underlying API infrastructure, or overwhelm our servers with automated scrapers or rate-limit violations.
      </p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>
        Querviam is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
      </p>

      <h2>6. Governing Law & Contact</h2>
      <p>
        For inquiries regarding these terms, please contact us at <a href="mailto:support@querviam.com">support@querviam.com</a>.
      </p>
    </div>
  `;

  return layout(
    'Terms of Service',
    'Terms of Service governing the use of Querviam educational language immersion platform.',
    content,
    'https://querviam.com/terms'
  );
}

export function renderAboutHtml(): string {
  const content = `
    <div class="card">
      <h1>About Querviam</h1>
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        Empowering language learners worldwide through comprehensible input, immersive storytelling, and AI-assisted pronunciation.
      </p>

      <h2>Our Mission</h2>
      <p>
        Traditional language instruction frequently bogs students down with dry grammatical charts and disjointed vocabulary lists. At Querviam, we believe true linguistic fluency occurs through <strong>immersion in compelling, meaningful stories</strong>.
      </p>

      <h2>The Pedagogical Framework</h2>
      <p>
        Querviam is built upon the principles of <strong>Stephen Krashen's Comprehensible Input Hypothesis</strong>. Learners acquire language naturally when exposed to content that is just slightly beyond their current competence (i + 1), framed in contextual narratives:
      </p>
      <ul>
        <li><strong>CEFR Level Grading:</strong> Every story is calibrated to standardized Common European Framework of Reference (CEFR) levels ranging from Introduction (A0-A1) to Master (C2+).</li>
        <li><strong>Dual-Line Synchronized Translation:</strong> Target language text is paired directly with English translations so learners never have to break focus to consult a dictionary.</li>
        <li><strong>Sentence-Level Native Audio:</strong> Integrated high-fidelity speech synthesis allows learners to hear rhythm, elision, and natural sentence intonation.</li>
        <li><strong>Phonemic Pronunciation Scoring:</strong> Learners can record their own speech to receive instantaneous feedback on phoneme clarity and acoustic match.</li>
      </ul>

      <h2>Publisher & Editorial Standards</h2>
      <p>
        Querviam was created and is actively maintained by <strong>Gordon Robb</strong>. Our reading catalog undergoes algorithmic and editorial verification to ensure culturally respectful, grammatically authentic representations of Italian, Spanish, French, German, Norwegian, and Czech.
      </p>

      <h2>Contact Us</h2>
      <p>
        We welcome feedback from educators, students, and linguists. Reach out at <a href="/contact">our Contact Page</a> or directly via email at <a href="mailto:support@querviam.com">support@querviam.com</a>.
      </p>
    </div>
  `;

  return layout(
    'About Querviam - Mission & Educational Methodology',
    'Learn about Querviam: Our pedagogical methodology based on Comprehensible Input, CEFR proficiency levels, and publisher standards.',
    content,
    'https://querviam.com/about'
  );
}

export function renderContactHtml(): string {
  const content = `
    <div class="card">
      <h1>Contact & Support</h1>
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        We are here to assist with learning inquiries, technical support, educational partnerships, and publisher feedback.
      </p>

      <h2>Publisher Contact Information</h2>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px;"><strong>Platform:</strong> Querviam (querviam.com)</p>
        <p style="margin: 0 0 8px;"><strong>Publisher:</strong> Gordon Robb</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:support@querviam.com" style="font-weight: 700;">support@querviam.com</a></p>
        <p style="margin: 0;"><strong>Response Time:</strong> We endeavor to respond to all student and publisher inquiries within 24 to 48 business hours.</p>
      </div>

      <h2>How to Reach Us</h2>
      <ul>
        <li><strong>Student Support:</strong> For assistance using the audio player, microphone permissions, or offline PWA capabilities.</li>
        <li><strong>Editorial Feedback:</strong> To suggest story topics, report language translation improvements, or propose vocabulary additions.</li>
        <li><strong>Commercial & Advertising:</strong> For advertising inquiries, Google AdSense publisher verification, or educational licensing.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <h3>Is Querviam completely free?</h3>
      <p>Yes. All core reading lessons, interactive conversation modes, and speech practice features are free to learners, supported by non-intrusive Google AdSense advertising on content screens.</p>

      <h3>How is my privacy protected?</h3>
      <p>All story generation and practice history remain private on your device in LocalStorage. For more details, consult our <a href="/privacy">Privacy Policy</a>.</p>
    </div>
  `;

  return layout(
    'Contact & Publisher Support',
    'Get in touch with Querviam for student support, publisher verification, educational feedback, or technical assistance.',
    content,
    'https://querviam.com/contact'
  );
}

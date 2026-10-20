import { VerbItem, VerbConjugationItem } from '../types';

/**
 * Standard person pronouns across common target languages
 */
export const PRONOUNS_BY_LANG: Record<string, string[]> = {
  italian: ['io', 'tu', 'lui / lei', 'noi', 'voi', 'loro'],
  spanish: ['yo', 'tú', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ellas'],
  french: ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'],
  german: ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie'],
  portuguese: ['eu', 'tu', 'ele / ela', 'nós', 'vós', 'eles / elas'],
  english: ['I', 'you', 'he / she / it', 'we', 'you (all)', 'they'],
};

/**
 * Ensures a VerbItem has complete Present, Past, and Future conjugation tables,
 * plus essential verb metadata (auxiliary, past participle, gerund, valence).
 */
export function enrichVerbData(
  verb: VerbItem,
  targetLang: string = 'Italian',
  baseLang: string = 'English'
): VerbItem {
  const langKey = (targetLang || 'italian').toLowerCase();
  const infinitive = (verb.infinitive || '').trim().toLowerCase();

  const conjugations: Record<string, VerbConjugationItem[]> = {
    ...(verb.conjugations || {}),
  };

  // If Italian
  if (langKey.includes('ital')) {
    return enrichItalianVerb(verb, conjugations);
  }

  // If Spanish
  if (langKey.includes('span') || langKey.includes('espa')) {
    return enrichSpanishVerb(verb, conjugations);
  }

  // If French
  if (langKey.includes('fren') || langKey.includes('fran')) {
    return enrichFrenchVerb(verb, conjugations);
  }

  // If German
  if (langKey.includes('germ') || langKey.includes('deut')) {
    return enrichGermanVerb(verb, conjugations);
  }

  // Default fallback for other languages: ensure at least present, past, future keys exist
  const pronouns = PRONOUNS_BY_LANG[langKey] || PRONOUNS_BY_LANG.english;
  if (!conjugations.present || conjugations.present.length === 0) {
    conjugations.present = pronouns.map((p) => ({ person: p, form: infinitive }));
  }
  if (!conjugations.past || conjugations.past.length === 0) {
    conjugations.past = pronouns.map((p) => ({ person: p, form: `${infinitive} (past)` }));
  }
  if (!conjugations.future || conjugations.future.length === 0) {
    conjugations.future = pronouns.map((p) => ({ person: p, form: `will ${infinitive}` }));
  }

  return {
    ...verb,
    conjugations,
  };
}

function enrichItalianVerb(
  verb: VerbItem,
  existingConj: Record<string, VerbConjugationItem[]>
): VerbItem {
  const inf = verb.infinitive.toLowerCase().trim();
  const pronouns = PRONOUNS_BY_LANG.italian;

  // Determine auxiliary verb
  const ESSERE_VERBS = new Set([
    'andare', 'venire', 'arrivare', 'partire', 'uscire', 'entrare', 'tornare', 'ritornare',
    'salire', 'scendere', 'cadere', 'nascere', 'morire', 'stare', 'essere', 'rimanere',
    'diventare', 'piacere', 'succedere', 'sembrare', 'riuscire'
  ]);
  const isEssere = ESSERE_VERBS.has(inf) || inf.endsWith('si');
  const auxiliary = verb.auxiliary || (isEssere ? 'essere' : 'avere');

  // Past Participle & Gerund
  let pastParticiple = verb.pastParticiple;
  let gerund = verb.gerund;

  // Irregular past participles
  const IRREGULAR_PP: Record<string, string> = {
    essere: 'stato', fare: 'fatto', dire: 'detto', leggere: 'letto', scrivere: 'scritto',
    vedere: 'visto', prendere: 'preso', mettere: 'messo', aprire: 'aperto', chiudere: 'chiuso',
    venire: 'venuto', nascere: 'nato', morire: 'morto', perdere: 'perso', rispondere: 'risposto',
    bere: 'bevuto', scegliere: 'scelto', vincere: 'vinto', vivere: 'vissuto', rimanere: 'rimasto',
    chiedere: 'chiesto', decidere: 'deciso', correre: 'corso', spendere: 'speso'
  };

  if (!pastParticiple) {
    if (IRREGULAR_PP[inf]) {
      pastParticiple = IRREGULAR_PP[inf];
    } else if (inf.endsWith('are')) {
      pastParticiple = inf.slice(0, -3) + 'ato';
    } else if (inf.endsWith('ere')) {
      pastParticiple = inf.slice(0, -3) + 'uto';
    } else if (inf.endsWith('ire')) {
      pastParticiple = inf.slice(0, -3) + 'ito';
    } else {
      pastParticiple = inf;
    }
  }

  if (!gerund) {
    if (inf === 'fare') gerund = 'facendo';
    else if (inf === 'dire') gerund = 'dicendo';
    else if (inf === 'bere') gerund = 'bevendo';
    else if (inf.endsWith('are')) gerund = inf.slice(0, -3) + 'ando';
    else gerund = inf.slice(0, -3) + 'endo';
  }

  // Preposition Patterns
  let prepositionPattern = verb.prepositionPattern;
  if (!prepositionPattern) {
    const PATTERNS: Record<string, string> = {
      pensare: 'pensare a [qualcuno/cosa]',
      parlare: 'parlare di [argomento] / con [persona]',
      credere: 'credere a / in [qualcosa]',
      andare: 'andare a [fare qualcosa] / in [luogo]',
      venire: 'venire da [luogo]',
      cercare: 'cercare di [fare qualcosa]',
      decidere: 'decidere di [fare qualcosa]',
      ricordare: 'ricordarsi di [qualcosa]',
      dimenticare: 'dimenticarsi di [qualcosa]',
      riuscire: 'riuscire a [fare qualcosa]',
      cominciare: 'cominciare a [fare qualcosa]',
      iniziare: 'iniziare a [fare qualcosa]',
      finire: 'finire di [fare qualcosa]',
      aiutare: 'aiutare [qualcuno] a [fare qualcosa]',
      piacere: '[a qualcuno] piace [qualcosa]'
    };
    if (PATTERNS[inf]) prepositionPattern = PATTERNS[inf];
  }

  // Build Past Tense (Passato Prossimo) if missing
  if (!existingConj.past || existingConj.past.length === 0) {
    const auxForms = isEssere
      ? ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']
      : ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'];

    const pp = pastParticiple || 'fatto';
    existingConj.past = pronouns.map((person, i) => {
      let form = '';
      if (isEssere) {
        // plural agreements
        const agreement = i >= 3 ? pp.replace(/o$/, 'i') : pp;
        form = `${auxForms[i]} ${agreement}`;
      } else {
        form = `${auxForms[i]} ${pp}`;
      }
      return { person, form };
    });
  }

  // Build Future Tense (Futuro Semplice) if missing
  if (!existingConj.future || existingConj.future.length === 0) {
    const endings = ['ò', 'ai', 'à', 'emo', 'ete', 'anno'];
    let stem = inf;

    if (inf === 'essere') stem = 'sar';
    else if (inf === 'avere') stem = 'avr';
    else if (inf === 'andare') stem = 'andr';
    else if (inf === 'vedere') stem = 'vedr';
    else if (inf === 'dovere') stem = 'dovr';
    else if (inf === 'potere') stem = 'potr';
    else if (inf === 'volere') stem = 'vorr';
    else if (inf === 'venire') stem = 'verr';
    else if (inf === 'fare') stem = 'far';
    else if (inf === 'dare') stem = 'dar';
    else if (inf === 'stare') stem = 'star';
    else if (inf.endsWith('are')) stem = inf.slice(0, -3) + 'er';
    else if (inf.endsWith('ere')) stem = inf.slice(0, -3) + 'er';
    else if (inf.endsWith('ire')) stem = inf.slice(0, -3) + 'ir';

    existingConj.future = pronouns.map((person, i) => ({
      person,
      form: `${stem}${endings[i]}`,
    }));
  }

  return {
    ...verb,
    auxiliary,
    pastParticiple,
    gerund,
    prepositionPattern,
    conjugations: existingConj,
  };
}

function enrichSpanishVerb(
  verb: VerbItem,
  existingConj: Record<string, VerbConjugationItem[]>
): VerbItem {
  const inf = verb.infinitive.toLowerCase().trim();
  const pronouns = PRONOUNS_BY_LANG.spanish;

  let pastParticiple = verb.pastParticiple;
  let gerund = verb.gerund;

  if (!pastParticiple) {
    if (inf === 'hacer') pastParticiple = 'hecho';
    else if (inf === 'decir') pastParticiple = 'dicho';
    else if (inf === 'ver') pastParticiple = 'visto';
    else if (inf === 'escribir') pastParticiple = 'escrito';
    else if (inf === 'abrir') pastParticiple = 'abierto';
    else if (inf === 'poner') pastParticiple = 'puesto';
    else if (inf === 'volver') pastParticiple = 'vuelto';
    else if (inf.endsWith('ar')) pastParticiple = inf.slice(0, -2) + 'ado';
    else pastParticiple = inf.slice(0, -2) + 'ido';
  }

  if (!gerund) {
    if (inf === 'decir') gerund = 'diciendo';
    else if (inf === 'dormir') gerund = 'durmiendo';
    else if (inf === 'leer') gerund = 'leyendo';
    else if (inf.endsWith('ar')) gerund = inf.slice(0, -2) + 'ando';
    else gerund = inf.slice(0, -2) + 'iendo';
  }

  // Preposition Patterns
  let prepositionPattern = verb.prepositionPattern;
  if (!prepositionPattern) {
    const PATTERNS: Record<string, string> = {
      pensar: 'pensar en [algo / alguien]',
      soñar: 'soñar con [algo / alguien]',
      hablar: 'hablar de [tema] / con [persona]',
      acordarse: 'acordarse de [algo]',
      olvidarse: 'olvidarse de [algo]',
      ir: 'ir a [lugar / inf.]',
      aprender: 'aprender a [inf.]',
      empezar: 'empezar a [inf.]',
      terminar: 'terminar de [inf.]',
      ayudar: 'ayudar a [alguien]',
      gustar: 'gustar de / [a mí] me gusta [algo]'
    };
    if (PATTERNS[inf]) prepositionPattern = PATTERNS[inf];
  }

  // Build Past Tense (Pretérito) if missing
  if (!existingConj.past || existingConj.past.length === 0) {
    if (inf === 'ser' || inf === 'ir') {
      const forms = ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'];
      existingConj.past = pronouns.map((person, i) => ({ person, form: forms[i] }));
    } else if (inf === 'hacer') {
      const forms = ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'];
      existingConj.past = pronouns.map((person, i) => ({ person, form: forms[i] }));
    } else if (inf === 'estar') {
      const forms = ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'];
      existingConj.past = pronouns.map((person, i) => ({ person, form: forms[i] }));
    } else if (inf === 'tener') {
      const forms = ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'];
      existingConj.past = pronouns.map((person, i) => ({ person, form: forms[i] }));
    } else if (inf.endsWith('ar')) {
      const stem = inf.slice(0, -2);
      const endings = ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'];
      existingConj.past = pronouns.map((person, i) => ({ person, form: `${stem}${endings[i]}` }));
    } else {
      const stem = inf.slice(0, -2);
      const endings = ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'];
      existingConj.past = pronouns.map((person, i) => ({ person, form: `${stem}${endings[i]}` }));
    }
  }

  // Build Future Tense if missing
  if (!existingConj.future || existingConj.future.length === 0) {
    const endings = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
    let stem = inf;
    if (inf === 'hacer') stem = 'har';
    else if (inf === 'tener') stem = 'tendr';
    else if (inf === 'poner') stem = 'pondr';
    else if (inf === 'decir') stem = 'dir';
    else if (inf === 'poder') stem = 'podr';
    else if (inf === 'querer') stem = 'querr';
    else if (inf === 'saber') stem = 'sabr';

    existingConj.future = pronouns.map((person, i) => ({
      person,
      form: `${stem}${endings[i]}`,
    }));
  }

  return {
    ...verb,
    auxiliary: verb.auxiliary || 'haber',
    pastParticiple,
    gerund,
    prepositionPattern,
    conjugations: existingConj,
  };
}

function enrichFrenchVerb(
  verb: VerbItem,
  existingConj: Record<string, VerbConjugationItem[]>
): VerbItem {
  const inf = verb.infinitive.toLowerCase().trim();
  const pronouns = PRONOUNS_BY_LANG.french;

  const ETRE_VERBS = new Set([
    'aller', 'venir', 'partir', 'arriver', 'entrer', 'sortir', 'monter', 'descendre',
    'tomber', 'naître', 'mourir', 'rester', 'retourner', 'passer'
  ]);
  const isEtre = ETRE_VERBS.has(inf) || inf.startsWith('se ') || inf.startsWith("s'");
  const auxiliary = verb.auxiliary || (isEtre ? 'être' : 'avoir');

  let pastParticiple = verb.pastParticiple;
  let gerund = verb.gerund;

  if (!pastParticiple) {
    if (inf === 'être') pastParticiple = 'été';
    else if (inf === 'avoir') pastParticiple = 'eu';
    else if (inf === 'faire') pastParticiple = 'fait';
    else if (inf === 'dire') pastParticiple = 'dit';
    else if (inf === 'voir') pastParticiple = 'vu';
    else if (inf === 'prendre') pastParticiple = 'pris';
    else if (inf === 'mettre') pastParticiple = 'mis';
    else if (inf.endsWith('er')) pastParticiple = inf.slice(0, -2) + 'é';
    else if (inf.endsWith('ir')) pastParticiple = inf.slice(0, -2) + 'i';
    else if (inf.endsWith('re')) pastParticiple = inf.slice(0, -2) + 'u';
    else pastParticiple = inf;
  }

  if (!gerund) {
    if (inf.endsWith('er')) gerund = inf.slice(0, -2) + 'ant';
    else if (inf.endsWith('ir')) gerund = inf.slice(0, -2) + 'issant';
    else gerund = inf.slice(0, -2) + 'ant';
  }

  // Passé Composé
  if (!existingConj.past || existingConj.past.length === 0) {
    const auxForms = isEtre
      ? ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']
      : ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
    const pp = pastParticiple || 'fait';

    existingConj.past = pronouns.map((person, i) => {
      const agreement = isEtre && i >= 3 ? `${pp}s` : pp;
      return { person, form: `${auxForms[i]} ${agreement}` };
    });
  }

  // Future (Futur Simple)
  if (!existingConj.future || existingConj.future.length === 0) {
    const endings = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
    let stem = inf;
    if (inf === 'être') stem = 'ser';
    else if (inf === 'avoir') stem = 'aur';
    else if (inf === 'aller') stem = 'ir';
    else if (inf === 'faire') stem = 'fer';
    else if (inf === 'pouvoir') stem = 'pourr';
    else if (inf === 'vouloir') stem = 'voudr';
    else if (inf === 'venir') stem = 'viendr';
    else if (inf.endsWith('re')) stem = inf.slice(0, -1);

    existingConj.future = pronouns.map((person, i) => ({
      person,
      form: `${stem}${endings[i]}`,
    }));
  }

  return {
    ...verb,
    auxiliary,
    pastParticiple,
    gerund,
    conjugations: existingConj,
  };
}

function enrichGermanVerb(
  verb: VerbItem,
  existingConj: Record<string, VerbConjugationItem[]>
): VerbItem {
  const inf = verb.infinitive.toLowerCase().trim();
  const pronouns = PRONOUNS_BY_LANG.german;

  const SEIN_VERBS = new Set([
    'sein', 'gehen', 'kommen', 'fahren', 'fliegen', 'reisen', 'bleiben', 'sterben', 'werden'
  ]);
  const isSein = SEIN_VERBS.has(inf);
  const auxiliary = verb.auxiliary || (isSein ? 'sein' : 'haben');

  let pastParticiple = verb.pastParticiple;
  if (!pastParticiple) {
    if (inf === 'sein') pastParticiple = 'gewesen';
    else if (inf === 'haben') pastParticiple = 'gehabt';
    else if (inf === 'gehen') pastParticiple = 'gegangen';
    else if (inf.endsWith('en')) pastParticiple = `ge${inf.slice(0, -2)}t`;
    else pastParticiple = `ge${inf}t`;
  }

  // Perfekt (Past)
  if (!existingConj.past || existingConj.past.length === 0) {
    const auxForms = isSein
      ? ['bin', 'bist', 'ist', 'sind', 'seid', 'sind']
      : ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'];
    const pp = pastParticiple || 'gemacht';

    existingConj.past = pronouns.map((person, i) => ({
      person,
      form: `${auxForms[i]} ... ${pp}`,
    }));
  }

  // Futur I
  if (!existingConj.future || existingConj.future.length === 0) {
    const werdenForms = ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'];
    existingConj.future = pronouns.map((person, i) => ({
      person,
      form: `${werdenForms[i]} ... ${inf}`,
    }));
  }

  return {
    ...verb,
    auxiliary,
    pastParticiple,
    conjugations: existingConj,
  };
}

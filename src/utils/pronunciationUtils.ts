import { PronunciationGuideInfo } from '../types';

/**
 * Returns an instant, high-quality articulatory pronunciation guide for any word in targetLang.
 */
export function getQuickPronunciationGuide(
  word: string,
  targetLang: string = 'Italian',
  baseLang: string = 'English'
): PronunciationGuideInfo {
  const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»，。！？、“”‘’：；《》（）…—]/g, '').trim();
  const lower = clean.toLowerCase();
  const lang = targetLang.toLowerCase();

  // 1. Chinese (Mandarin)
  if (lang.includes('chinese') || lang.includes('mandarin') || /[\u4e00-\u9fa5]/.test(clean)) {
    return {
      ipa: `[${clean}]`,
      syllables: clean.split('').join(' · '),
      stressedSyllable: clean,
      tonguePlacement:
        "For retroflex sounds (zh, ch, sh, r), curl the tip of your tongue gently upward toward the hard palate just behind the gum ridge. For dental sibilants (z, c, s), keep the tongue tip flat and resting lightly behind your bottom teeth.",
      lipAndMouthPosition:
        "Keep your lips stable throughout each syllable. Avoid sliding your mouth during single vowels. For sounds like 'ü' (yu), round lips tight as if whistling while keeping tongue fronted.",
      airflowAndVoicing:
        "Chinese distinguishes words by breath (aspiration), not throat voicing: 'p, t, k, c, ch, q' require a distinct puff of air, while 'b, d, g, z, zh, j' must have zero breath burst.",
      learnerPitfalls:
        "Watch your pitch! Native English speakers often raise pitch at the end of words or sentences like questions—this changes the meaning in Chinese. Keep 1st tone high and flat (55), 2nd rising (35), 3rd dipping low (214), and 4th falling firmly (51).",
      toneOrPitchGuide: "Pay close attention to the tone marker above each vowel. Steady pitch control is essential.",
      soundAlike: clean,
      memoryHook: "Lock in the tone pitch first, then articulate the initial consonant with the proper breath control."
    };
  }

  // Syllable breakdown approximation
  const syllables = breakIntoSyllables(lower);
  const stressed = syllables.length > 1 ? syllables[Math.max(0, syllables.length - 2)].toUpperCase() : lower.toUpperCase();
  const syllableDisplay = syllables
    .map((s, idx) => (idx === Math.max(0, syllables.length - 2) ? s.toUpperCase() : s))
    .join('-');

  // 2. Italian
  if (lang.includes('italian') || lang.includes('ital')) {
    const hasDoubleConsonants = /([bcdfghlmnpqrstvz])\1/i.test(lower);
    const hasGli = lower.includes('gli');
    const hasGn = lower.includes('gn');
    const hasSci = lower.includes('sci') || lower.includes('sce');
    const hasR = lower.includes('r');

    let tongue = "Rest your tongue forward in your mouth. For 't', 'd', and 'n', tap the tip against your upper front teeth rather than the gum ridge.";
    if (hasGli) tongue = "For 'gli', press the broad middle of your tongue against the hard palate (roof of mouth), letting air escape around the sides (like 'million').";
    else if (hasGn) tongue = "For 'gn', press the flat blade of your tongue against the hard palate (like 'canyon' or Spanish 'ñ').";
    else if (hasR) tongue = "For 'r', place your tongue tip lightly against the ridge behind your upper teeth and release a quick single or double tap.";

    let lips = "Produce pure, tense vowels (a, e, i, o, u). Open your jaw generously on 'a' and round lips firmly for 'o' and 'u' without moving them.";
    let airflow = "Vowels are fully voiced with resonant tone. Unaspirated consonants: do not puff air after 'p', 't', or 'c'.";
    if (hasDoubleConsonants) {
      airflow += " Double consonants: halt your airflow briefly and hold the consonant for twice the normal duration before releasing.";
    }

    return {
      ipa: `/${lower}/`,
      syllables: syllableDisplay,
      stressedSyllable: stressed,
      tonguePlacement: tongue,
      lipAndMouthPosition: lips,
      airflowAndVoicing: airflow,
      learnerPitfalls:
        "English speakers tend to turn 'o' and 'e' into diphthongs (like 'oh-oo' in 'go'). Keep Italian vowels 100% pure, crisp, and unchanging from start to finish.",
      toneOrPitchGuide: "Most Italian words carry stress on the penultimate (second-to-last) syllable. Elongate the vowel of the stressed syllable slightly.",
      soundAlike: syllables.join('-'),
      memoryHook: "Keep your mouth active and vowels bright and pure—never swallow or reduce unstressed syllables."
    };
  }

  // 3. Spanish
  if (lang.includes('spanish') || lang.includes('español')) {
    const hasRr = lower.includes('rr') || lower.startsWith('r');
    const hasD = lower.includes('d');
    const hasBv = lower.includes('b') || lower.includes('v');

    let tongue = "Keep your tongue tip near the upper teeth. For 't' and 'd', touch the inner surface of your upper front teeth directly.";
    if (hasRr) tongue = "For 'rr', curl your tongue tip lightly behind your top teeth and blow air across it steadily to create a vibrant rolling trill.";
    else if (hasD) tongue = "Between vowels, 'd' softens: touch your tongue tip lightly between your teeth, exactly like the 'th' in English 'this'.";

    let lips = "Keep the 5 vowels (a, e, i, o, u) short, crisp, and open.";
    if (hasBv) lips = "For 'b' and 'v', bring both lips close together without touching your teeth—let air vibrate smoothly between them.";

    return {
      ipa: `/${lower}/`,
      syllables: syllableDisplay,
      stressedSyllable: stressed,
      tonguePlacement: tongue,
      lipAndMouthPosition: lips,
      airflowAndVoicing: "Crisp, unaspirated consonants: zero puff of air on 'p', 't', 'k'. Clean vocal resonance on all vowels.",
      learnerPitfalls:
        "Never reduce unstressed vowels into an English 'uh' (schwa). Every vowel must ring out with clarity, and 'v' is never pronounced with bottom teeth.",
      toneOrPitchGuide: "Natural stress falls on the penultimate syllable if ending in a vowel, 'n', or 's'; otherwise on the final syllable unless marked with an accent (tilde).",
      soundAlike: syllables.join('-'),
      memoryHook: "Keep vowels razor-sharp and never glide into English diphthongs."
    };
  }

  // 4. French
  if (lang.includes('french') || lang.includes('français')) {
    const hasU = lower.includes('u') && !lower.includes('ou');
    const hasNasal = /([aeiou])n\b|([aeiou])m\b/i.test(lower);
    const hasR = lower.includes('r');

    let tongue = "Position your tongue forward and arched for front vowels.";
    if (hasR) tongue = "For French 'r', keep your tongue tip down behind your bottom teeth and vibrate the uvula at the very back of your throat.";
    else if (hasU) tongue = "For 'u', position your tongue forward as if saying 'ee', but shape your lips into a tight round whistle.";

    let lips = "French requires very active lip movement. Round lips forward into a funnel shape for 'u', 'eu', and 'ou'.";
    if (hasNasal) lips += " For nasal vowels, lower your soft palate to let air resonate simultaneously through your nose and mouth.";

    return {
      ipa: `/${lower}/`,
      syllables: syllableDisplay,
      stressedSyllable: syllables[syllables.length - 1].toUpperCase(),
      tonguePlacement: tongue,
      lipAndMouthPosition: lips,
      airflowAndVoicing: "Continuous, smooth airflow. Final consonants are generally silent unless linked to the next word via liaison.",
      learnerPitfalls:
        "The difference between 'u' (/y/) and 'ou' (/u/) is critical. Do not let your tongue slide backward on 'u'.",
      toneOrPitchGuide: "French has syllable-timed rhythm with gentle rising pitch on the very last syllable of a phrase.",
      soundAlike: syllables.join('-'),
      memoryHook: "Keep the tongue tip low and anchor the vowels firmly forward in the mouth."
    };
  }

  // 5. German
  if (lang.includes('german') || lang.includes('deutsch')) {
    const hasCh = lower.includes('ch');
    const hasSch = lower.includes('sch');
    const hasUmlaut = /[äöüß]/.test(lower);

    let tongue = "Keep tongue muscular and precise.";
    if (hasCh) {
      tongue = lower.includes('ich') || lower.includes('ech') || lower.includes('lich')
        ? "For the 'ich-Laut' (ch after e, i), arch the middle of your tongue high toward the hard palate and hiss air through softly (like a whispering cat)."
        : "For the 'ach-Laut' (ch after a, o, u), position the back of your tongue near the soft palate and produce gentle friction.";
    }

    return {
      ipa: `/${lower}/`,
      syllables: syllableDisplay,
      stressedSyllable: stressed,
      tonguePlacement: tongue,
      lipAndMouthPosition: "For umlauts 'ö' and 'ü', round lips firmly forward into a circle while maintaining the tongue position of 'eh' or 'ee'.",
      airflowAndVoicing: "Strong aspiration on 'p, t, k'. Final voiced consonants ('b, d, g') devoice into crisp 'p, t, k' sounds.",
      learnerPitfalls: "Remember the glottal stop: start vowel-initial syllables with a clean, crisp separation in the vocal cords.",
      toneOrPitchGuide: "Stress typically falls on the root syllable or prefix depending on whether it is separable.",
      soundAlike: syllables.join('-'),
      memoryHook: "Sharp consonant releases and distinct vowel tenseness."
    };
  }

  // Default / Other Languages
  return {
    ipa: `/${lower}/`,
    syllables: syllableDisplay,
    stressedSyllable: stressed,
    tonguePlacement: "Keep the tongue tip resting lightly behind your upper front teeth for dental consonants, and maintain steady tongue height on vowels.",
    lipAndMouthPosition: "Keep mouth shape stable during each vowel. Avoid sliding between vowel sounds.",
    airflowAndVoicing: "Notice where your vocal cords vibrate in the throat. Ensure clear consonant releases.",
    learnerPitfalls: "Avoid English vowel reduction (schwa). Pronounce each syllable with deliberate intention and clear resonance.",
    toneOrPitchGuide: "Pay attention to word stress: elongate the vowel on the accented syllable.",
    soundAlike: syllables.join('-'),
    memoryHook: "Listen to the audio, mirror the tongue and mouth shape, and repeat aloud."
  };
}

function breakIntoSyllables(word: string): string[] {
  if (word.length <= 3) return [word];
  // Simple heuristic syllable splitter based on vowel clusters
  const parts: string[] = [];
  let current = '';
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'à', 'è', 'é', 'ì', 'ò', 'ù', 'á', 'é', 'í', 'ó', 'ú', 'ä', 'ö', 'ü']);

  for (let i = 0; i < word.length; i++) {
    current += word[i];
    const isVowel = vowels.has(word[i]);
    const nextIsConsonant = i + 1 < word.length && !vowels.has(word[i + 1]);
    const nextNextIsVowel = i + 2 < word.length && vowels.has(word[i + 2]);

    if (isVowel && nextIsConsonant && nextNextIsVowel && current.length >= 2) {
      parts.push(current);
      current = '';
    }
  }
  if (current) parts.push(current);
  return parts.length > 0 ? parts : [word];
}

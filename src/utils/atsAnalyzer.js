// Set of common English stop words to filter out from keyword extraction
export const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 
  'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 
  'weren', 'won', 'wouldn', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 
  'an', 'and', 'any', 'are', 'arent', 'as', 'at', 'be', 'because', 'been', 'before', 
  'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could', 'couldnt', 
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 
  'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 
  'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 
  'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 
  'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 
  'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 
  'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 
  'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 
  'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 
  'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 
  'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 
  'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Action verbs list for suggestions (20 items)
export const ACTION_VERBS = [
  'led', 'developed', 'optimized', 'architected', 'implemented', 'designed', 'streamlined',
  'automated', 'executed', 'built', 'created', 'managed', 'directed', 'coordinated',
  'enhanced', 'engineered', 'formulated', 'spearheaded', 'pioneered', 'transformed'
];

// Common programming language / framework list to detect in missing keywords (39 items)
export const FRAMEWORKS_AND_LANGUAGES = [
  'react', 'vue', 'angular', 'svelte', 'nextjs', 'next.js', 'nuxtjs', 'sveltekit', 'typescript', 
  'javascript', 'python', 'java', 'c++', 'golang', 'rust', 'ruby', 'rails', 'php', 'laravel', 
  'django', 'flask', 'fastapi', 'spring', 'express', 'nestjs', 'redux', 'tailwind', 'bootstrap', 
  'graphql', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes', 'aws', 
  'gcp', 'azure', 'git', 'github', 'gitlab', 'ci/cd', 'jenkins', 'terraform'
];

/**
 * Normalizes text: converts to lowercase and replaces punctuation with spaces
 * @param {string} text 
 * @returns {string}
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\-\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts unique, meaningful keywords from raw text
 * @param {string} rawText 
 * @returns {Set<string>}
 */
export function extractKeywords(rawText) {
  if (!rawText) return new Set();
  
  const normalized = normalizeText(rawText);
  const tokens = normalized.split(/\s+/);
  
  const keywords = new Set();
  for (const token of tokens) {
    let cleanToken = token.replace(/\.+$/, '').trim();
    if (
      cleanToken.length > 0 &&
      !/^\d+$/.test(cleanToken) && 
      !STOP_WORDS.has(cleanToken)
    ) {
      if (cleanToken.length === 1 && !['c', 'r', 'g', 'q'].includes(cleanToken)) {
        continue;
      }
      keywords.add(cleanToken);
    }
  }
  
  return keywords;
}

/**
 * Standalone ATS quality audit when no Job Description is provided.
 * Scores on 6 signals totalling 100 pts.
 * Calibrated so that a typical good resume scores ~50–70%.
 * @param {string} resumeText
 * @returns {Object}
 */
export function analyzeResumeOnly(resumeText) {
  const resumeKeywords = extractKeywords(resumeText);
  const resumeLower = resumeText.toLowerCase();
  const suggestions = [];

  // --- Signal 1: Action verbs (max 25 pts) ---
  // ACTION_VERBS has 20 items. Denominator is 30 so even a perfect 20/20 only gives 16-17 pts.
  // This forces hard differentiation: 5 verbs→4pts, 10 verbs→8pts, 20 verbs→17pts.
  const actionVerbsFound = ACTION_VERBS.filter(verb => resumeLower.includes(verb));
  const verbScore = Math.min(25, Math.round((actionVerbsFound.length / 30) * 25));
  if (actionVerbsFound.length < 7) {
    suggestions.push({
      id: 'verbs',
      title: 'Add high-impact action verbs',
      desc: `Only ${actionVerbsFound.length} out of 20 benchmarked action verbs found. Use verbs like "Spearheaded", "Optimized", "Automated", "Architected" at the start of every experience bullet point.`,
      action: 'Use action verbs'
    });
  }

  // --- Signal 2: Technical keyword richness (max 20 pts) ---
  // FRAMEWORKS_AND_LANGUAGES has 45 items. Denominator = 25; need 25+ (55%) to max out.
  // 5 terms→4pts, 10→8pts, 20→16pts, 25+→20pts.
  const techTermsFound = FRAMEWORKS_AND_LANGUAGES.filter(term => resumeLower.includes(term));
  const techScore = Math.min(20, Math.round((techTermsFound.length / 25) * 20));
  if (techTermsFound.length < 6) {
    suggestions.push({
      id: 'tech',
      title: 'List your technical skills explicitly',
      desc: `Only ${techTermsFound.length} technical term(s) detected. Include a dedicated Skills section with tools, languages, and frameworks. ATS systems scan for these exact terms.`,
      action: 'Add technical skills'
    });
  }

  // --- Signal 3: Quantified achievements (max 25 pts) ---
  // Filter out calendar years (1900-2099) — they are NOT achievements.
  // Denominator = 20: need 20 real metrics to max. 5 numbers→6pts, 10→13pts, 15→19pts.
  const allNumbers = resumeText.match(/\b\d+[%$+x]?\b|\$[\d,]+/g) || [];
  const meaningfulNumbers = allNumbers.filter(n => !/^(19|20)\d{2}$/.test(n));
  const achievementScore = Math.min(25, Math.round((meaningfulNumbers.length / 20) * 25));
  if (meaningfulNumbers.length < 5) {
    suggestions.push({
      id: 'numbers',
      title: 'Quantify your achievements',
      desc: `Only ${meaningfulNumbers.length} measurable metric(s) found (years/dates excluded). Add real numbers: "reduced load time by 40%", "managed team of 8", "increased revenue by $50K" — ideally one metric per bullet.`,
      action: 'Add metrics'
    });
  }

  // --- Signal 4: Section structure (max 15 pts) ---
  // 10 standard sections. Denominator = 10 (all sections required to max).
  // 2 sections→3pts, 4→6pts, 6→9pts, 8→12pts, 10→15pts.
  const sectionKeywords = ['experience', 'education', 'skills', 'projects', 'summary', 'objective', 'certifications', 'awards', 'publications', 'volunteer'];
  const sectionsFound = sectionKeywords.filter(kw => resumeLower.includes(kw));
  const structureScore = Math.min(15, Math.round((sectionsFound.length / 10) * 15));
  if (sectionsFound.length < 4) {
    suggestions.push({
      id: 'structure',
      title: 'Use standard section headings',
      desc: `Only ${sectionsFound.length} out of 10 standard section(s) detected. Include clear headers like "Work Experience", "Education", "Skills", and "Projects" so ATS parsers correctly categorize your content.`,
      action: 'Improve structure'
    });
  }

  // --- Signal 5: Contact info completeness (max 10 pts) ---
  let contactScore = 0;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) contactScore += 4; // email
  if (/(\+?[\d][\d\s\-().]{7,}\d)/.test(resumeText)) contactScore += 3;                       // phone
  if (/linkedin/i.test(resumeText)) contactScore += 3;                                         // linkedin
  if (contactScore < 7) {
    suggestions.push({
      id: 'contact',
      title: 'Complete your contact information',
      desc: 'Ensure your email, phone number, and LinkedIn profile URL are clearly visible. Missing contact info is an immediate ATS red flag.',
      action: 'Add contact info'
    });
  }

  // --- Signal 6: Resume length (max 5 pts) ---
  const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;
  let lengthScore = 0;
  if (wordCount >= 350 && wordCount <= 800) {
    lengthScore = 5; // Ideal range
  } else if ((wordCount >= 200 && wordCount < 350) || (wordCount > 800 && wordCount <= 1100)) {
    lengthScore = 3; // Acceptable
  } else if (wordCount >= 100) {
    lengthScore = 1; // Too short or too long
  }
  if (wordCount < 300) {
    suggestions.push({
      id: 'length',
      title: 'Expand your resume content',
      desc: `Your resume has only ${wordCount} words. ATS systems expect 350–800 words for a single-page resume. Add more detail to your experience bullet points.`,
      action: 'Add more detail'
    });
  } else if (wordCount > 1100) {
    suggestions.push({
      id: 'length-long',
      title: 'Trim resume to 1–2 pages',
      desc: `Your resume has ${wordCount} words which may be too long. Most ATS systems prefer concise, focused resumes. Aim for under 800 words per page.`,
      action: 'Condense resume'
    });
  }

  // Always add formatting tip
  suggestions.push({
    id: 'format',
    title: 'Format for parsing clarity',
    desc: 'Avoid multi-column layouts, tables, graphics, and text boxes. ATS systems parse left-to-right and commonly misread complex designs. Use a clean single-column format.',
    action: 'Verify formatting'
  });

  const totalScore = verbScore + techScore + achievementScore + structureScore + contactScore + lengthScore;

  return {
    score: totalScore,
    mode: 'resume-only',
    totalKeywords: resumeKeywords.size,
    matchedCount: techTermsFound.length,
    missingCount: 0,
    matchedKeywords: techTermsFound.sort(),
    missingKeywords: [],
    signals: {
      verbScore,
      techScore,
      achievementScore,
      structureScore,
      contactScore,
      lengthScore,
      actionVerbsFound,
      techTermsFound,
      numberMatches: meaningfulNumbers.length,
      sectionsFound,
      wordCount,
    },
    suggestions
  };
}

/**
 * Computes ATS comparison between resume and job description text.
 * Falls back to analyzeResumeOnly() when no JD is given.
 * @param {string} resumeText 
 * @param {string} jobDescriptionText 
 * @returns {Object}
 */
export function analyzeResumeATS(resumeText, jobDescriptionText) {
  // If no job description, fall back to resume-only quality audit
  if (!jobDescriptionText || !jobDescriptionText.trim()) {
    return analyzeResumeOnly(resumeText);
  }

  const resumeKeywords = extractKeywords(resumeText);
  const jdKeywords = extractKeywords(jobDescriptionText);
  
  // Find intersection and difference
  const matchedKeywords = new Set();
  const missingKeywords = new Set();
  
  for (const word of jdKeywords) {
    if (resumeKeywords.has(word)) {
      matchedKeywords.add(word);
    } else {
      missingKeywords.add(word);
    }
  }
  
  const totalJDCount = jdKeywords.size;
  const matchedCount = matchedKeywords.size;
  const missingCount = missingKeywords.size;
  
  // Calculate Score = (Matched / Total JD) * 100
  const score = totalJDCount > 0 ? Math.round((matchedCount / totalJDCount) * 100) : 0;
  
  // Compile customized suggestions
  const suggestions = [];
  
  // 1. Frameworks/Languages suggestions
  const missingFrameworks = [...missingKeywords].filter(word => 
    FRAMEWORKS_AND_LANGUAGES.includes(word)
  );
  if (missingFrameworks.length > 0) {
    const listStr = missingFrameworks.slice(0, 5).join(', ');
    suggestions.push({
      id: 'frameworks',
      title: 'Add missing frameworks & languages',
      desc: `Your resume is missing technical keywords: ${listStr}. Consider adding them under your Skills or Experience section if you have worked with them.`,
      action: 'Add technical skills'
    });
  } else if (missingCount > 0) {
    const listStr = [...missingKeywords].slice(0, 5).join(', ');
    suggestions.push({
      id: 'skills',
      title: 'Add missing technical skills',
      desc: `The job posting references these terms which aren't found in your resume: ${listStr}. Incorporate these keywords to improve match alignment.`,
      action: 'Integrate keywords'
    });
  }
  
  // 2. Keyword density suggestion
  if (score < 70) {
    suggestions.push({
      id: 'density',
      title: 'Improve keyword density',
      desc: `Your alignment score is below 70%. Try weaving more role-specific terminology from the job description directly into your work experience descriptions.`,
      action: 'Increase matches'
    });
  }
  
  // 3. Action verbs suggestion
  const resumeLower = resumeText.toLowerCase();
  const actionVerbsFound = ACTION_VERBS.filter(verb => resumeLower.includes(verb));
  if (actionVerbsFound.length < 3) {
    suggestions.push({
      id: 'verbs',
      title: 'Add high-impact action verbs',
      desc: 'Use strong action verbs (like "Spearheaded", "Optimized", "Architected", "Automated") to start your experience bullets, highlighting active accomplishments.',
      action: 'Use action verbs'
    });
  }
  
  // General suggestion for polishing
  suggestions.push({
    id: 'format',
    title: 'Format for parsing clarity',
    desc: 'Ensure your work experience sections use standard headings (e.g. "Work Experience", "Education") and avoid complex text layouts like double column tables.',
    action: 'Verify formatting'
  });
  
  return {
    score,
    totalKeywords: totalJDCount,
    matchedCount,
    missingCount,
    matchedKeywords: Array.from(matchedKeywords).sort(),
    missingKeywords: Array.from(missingKeywords).sort(),
    suggestions
  };
}

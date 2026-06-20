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

// Action verbs list for suggestions
export const ACTION_VERBS = [
  'led', 'developed', 'optimized', 'architected', 'implemented', 'designed', 'streamlined',
  'automated', 'executed', 'built', 'created', 'managed', 'directed', 'coordinated',
  'enhanced', 'engineered', 'formulated', 'spearheaded', 'pioneered', 'transformed'
];

// Common programming language / framework list to detect in missing keywords
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
    // Replace most punctuation with spaces, keeping alphanumeric, hyphens, and underscores
    .replace(/[^\w\s\-\.]/g, ' ')
    // Replace multiple spaces or newlines with a single space
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
  // Split into tokens
  const tokens = normalized.split(/\s+/);
  
  const keywords = new Set();
  for (const token of tokens) {
    // Clean token: strip trailing periods (e.g. from end of sentences)
    let cleanToken = token.replace(/\.+$/, '').trim();
    
    // Ignore empty tokens, tokens that are purely numeric, or common stop words
    if (
      cleanToken.length > 0 &&
      !/^\d+$/.test(cleanToken) && 
      !STOP_WORDS.has(cleanToken)
    ) {
      // Keep single-letter words only if they are important (e.g., 'c', 'r', 'g')
      if (cleanToken.length === 1 && !['c', 'r', 'g', 'q'].includes(cleanToken)) {
        continue;
      }
      keywords.add(cleanToken);
    }
  }
  
  return keywords;
}

/**
 * Computes ATS comparison between resume and job description text
 * @param {string} resumeText 
 * @param {string} jobDescriptionText 
 * @returns {Object}
 */
export function analyzeResumeATS(resumeText, jobDescriptionText) {
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
  // Analyze if there are enough action verbs in the resume text
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

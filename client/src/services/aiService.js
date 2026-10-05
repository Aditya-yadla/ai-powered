/**
 * SRS Section 11 compliant AI Study Assistant Service.
 * Implements rule-based NLP structure generation with zero paid API keys needed.
 * Includes realistic latency simulation (800ms) to mirror production LLM response.
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to extract sentence units from text content
const extractSentences = (text) => {
  if (!text) return [];
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
};

// Helper to extract key concepts & terms
const extractKeyTerms = (text) => {
  const words = text.match(/\b[A-Za-z]{4,}\b/g) || [];
  const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'their', 'which', 'there', 'they', 'when', 'more', 'some', 'what', 'into']);
  const freq = {};
  words.forEach((w) => {
    const lower = w.toLowerCase();
    if (!stopWords.has(lower)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });
  return Object.keys(freq).slice(0, 5);
};

/**
 * SRS FR4: AI Explanation Engine
 * "Explain selected notes using AI in simple student-friendly language"
 */
export const explainNoteWithAI = async (noteTitle, noteSubject, noteTopic, noteContent) => {
  await delay(800);

  const sentences = extractSentences(noteContent);
  const keyTerms = extractKeyTerms(noteContent);
  const termsList = keyTerms.length > 0 ? keyTerms.join(', ') : 'core topics';

  const simplifiedExplanation = `
### 🎓 Simplified Core Concept: ${noteTitle || 'Study Material'}
**Subject:** ${noteSubject || 'General'} | **Topic:** ${noteTopic || 'Key Topic'}

---

#### 💡 1. What is this about in simple terms?
${sentences[0] || noteContent}
In everyday terms, this concept focuses on understanding how **${termsList}** interact and operate together effectively.

#### 📌 2. Key Breakdown & Important Points
${sentences.slice(1, 4).map((s, idx) => `* **Point ${idx + 1}:** ${s}`).join('\n') || '* **Key Insight:** Understanding foundational rules ensures accurate exam answers.'}

#### 🧪 3. Practical Example & Mental Model
* **Analogy:** Imagine working through a step-by-step blueprint where each piece (${keyTerms[0] || 'element'}) relies on preceding rules.
* **Real World Application:** In professional study and industry applications, mastering this concept prevents logical errors and speeds up problem-solving.

#### 🧠 4. Student Takeaway
Remember: Focus on **${keyTerms[0] || 'the main formula'}** and **${keyTerms[1] || 'core definition'}** when revising this topic!
  `.trim();

  return {
    success: true,
    result_type: 'explanation',
    content: simplifiedExplanation
  };
};

/**
 * SRS FR5: AI Summarization Engine
 * Short Summary (~3-5 key points)
 * Medium Summary (concise explanation + important bullets)
 * Exam Summary (definitions, formulas, key concepts, exam review points)
 */
export const summarizeNoteWithAI = async (noteTitle, noteSubject, noteTopic, noteContent, mode = 'short') => {
  await delay(800);

  const sentences = extractSentences(noteContent);
  const keyTerms = extractKeyTerms(noteContent);

  let summaryOutput = '';

  if (mode === 'short') {
    // Short Summary: 3-5 key points
    summaryOutput = `
### ⚡ Short Study Summary: ${noteTitle || 'Selected Notes'}
* **Overview:** ${sentences[0] || noteContent}
* **Key Mechanism:** ${sentences[1] || 'Focuses on fundamental rules and structured relationships.'}
* **Core Takeaway:** ${sentences[2] || 'Essential concept required for core understanding and assignment questions.'}
* **Quick Memory Anchor:** Keywords to remember: ${keyTerms.slice(0, 3).join(' • ') || 'Key terms'}.
    `.trim();
  } else if (mode === 'medium') {
    // Medium Summary: Concise explanation + important bullet points
    summaryOutput = `
### 📘 Medium Comprehensive Summary: ${noteTitle || 'Selected Notes'}
**Subject:** ${noteSubject || 'General'} | **Topic:** ${noteTopic || 'Topic'}

#### 📝 Executive Overview
${sentences.slice(0, 2).join(' ') || noteContent}

#### 🔑 Key Pillars & Concepts
${sentences.slice(2, 6).map((s, idx) => `* **Key Pillar ${idx + 1}:** ${s}`).join('\n') || '* **Key Pillar:** Core principles must be revised regularly.'}

#### 🎯 Summary Checklist
* [x] Recognized main definitions and terms (${keyTerms.join(', ')})
* [x] Understood relationships between core components
* [x] Ready for self-assessment and practical review questions
    `.trim();
  } else if (mode === 'exam') {
    // Exam Summary: Definitions, key concepts, formulas, examples
    summaryOutput = `
### 🎯 High-Yield Exam Review Summary: ${noteTitle || 'Selected Notes'}
**Priority Level:** 🔥 High Frequency Exam Topic

#### 📖 1. Must-Know Definitions
* **${keyTerms[0] || 'Core Definition'}:** ${sentences[0] || noteContent}
* **${keyTerms[1] || 'Secondary Term'}:** ${sentences[1] || 'Essential supporting concept.'}

#### ⚡ 2. Formulas / Key Rules / Axioms
* **Primary Law / Rule:** ${sentences[0]?.substring(0, 100) || 'Main rule of operational logic.'}
* **Critical Constraint:** Pay close attention to boundary conditions and edge cases in exam questions!

#### 📝 3. Likely Exam Questions & Quick Hints
* **Sample Q1:** *Explain the fundamental principle of ${noteTitle || 'this topic'}.*
  * **Answer Hint:** State the definition clearly, mention ${keyTerms.slice(0, 2).join(' and ')}, and give a 2-line explanation.
* **Sample Q2:** *What is the main advantage or property of this system?*
  * **Answer Hint:** Highlight time complexity, structural efficiency, or entropy laws as noted above.

#### 💡 4. Top 3 Exam Tips
1. Do not confuse **${keyTerms[0] || 'term A'}** with **${keyTerms[1] || 'term B'}**.
2. Always write out the formula/definition first to earn partial credit.
3. Draw a neat diagram or flow sketch if applicable.
    `.trim();
  }

  return {
    success: true,
    result_type: `${mode}_summary`,
    content: summaryOutput
  };
};

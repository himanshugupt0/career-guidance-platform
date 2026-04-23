// ================= SCIENCE (10) =================
export const scienceQuestions = [
  { id: 's1', question: 'A student solves numerical problems using formulas and logical steps. Which skill is strongest?', options: ['Creativity','Analytical reasoning','Communication','Memorization'], stream: 'Science', correct: 1 },
  { id: 's2', question: 'Which field primarily requires knowledge of calculus and physics laws?', options: ['Medicine','Engineering','Law','Design'], stream: 'Science', correct: 1 },
  { id: 's3', question: 'If a student prefers experiment-based learning, which domain suits best?', options: ['Humanities','Commerce','Science','Management'], stream: 'Science', correct: 2 },
  { id: 's4', question: 'Which concept is used to design circuits in electronics?', options: ['Supply chain','Ohm’s Law','Demand curve','Grammar rules'], stream: 'Science', correct: 1 },
  { id: 's5', question: 'A student enjoys solving algorithm-based problems. Suitable career?', options: ['Lawyer','Data Scientist','Journalist','Economist'], stream: 'Science', correct: 1 },
  { id: 's6', question: 'Which subject combination is required for medical entrance exams?', options: ['PCM','PCB','Commerce','Arts'], stream: 'Science', correct: 1 },
  { id: 's7', question: 'Which tool is used for data analysis in tech fields?', options: ['Excel only','Python','Photoshop','Canva'], stream: 'Science', correct: 1 },
  { id: 's8', question: 'AI & Machine Learning belong to which stream?', options: ['Arts','Commerce','Science','Law'], stream: 'Science', correct: 2 },
  { id: 's9', question: 'Which branch deals with designing buildings and structures?', options: ['Mechanical','Civil','Electrical','Chemical'], stream: 'Science', correct: 1 },
  { id: 's10', question: 'Which skill is most important in scientific research?', options: ['Guessing','Observation & experimentation','Marketing','Storytelling'], stream: 'Science', correct: 1 },
]

// ================= COMMERCE (10) =================
export const commerceQuestions = [
  { id: 'c1', question: 'Which subject deals with recording financial transactions?', options: ['Economics','Accountancy','Marketing','Law'], stream: 'Commerce', correct: 1 },
  { id: 'c2', question: 'Which concept explains demand vs price relationship?', options: ['Balance sheet','Demand curve','Algorithm','Circuit'], stream: 'Commerce', correct: 1 },
  { id: 'c3', question: 'A student interested in stock market analysis should choose?', options: ['Arts','Science','Commerce','Medical'], stream: 'Commerce', correct: 2 },
  { id: 'c4', question: 'Which tool is commonly used for financial data analysis?', options: ['Excel','AutoCAD','Figma','Blender'], stream: 'Commerce', correct: 0 },
  { id: 'c5', question: 'Which career requires clearing CA exams?', options: ['Engineer','Chartered Accountant','Doctor','Designer'], stream: 'Commerce', correct: 1 },
  { id: 'c6', question: 'Which concept is used in business decision-making?', options: ['Newton’s Law','Cost-benefit analysis','DNA structure','Grammar'], stream: 'Commerce', correct: 1 },
  { id: 'c7', question: 'Which field focuses on managing employees and organizations?', options: ['HR Management','Physics','Chemistry','Geography'], stream: 'Commerce', correct: 0 },
  { id: 'c8', question: 'Which subject helps understand GDP, inflation, economy?', options: ['Economics','Biology','History','Computer Science'], stream: 'Commerce', correct: 0 },
  { id: 'c9', question: 'Which skill is most important for entrepreneurship?', options: ['Drawing','Risk-taking','Memorization','Acting'], stream: 'Commerce', correct: 1 },
  { id: 'c10', question: 'Which system records assets, liabilities, and capital?', options: ['Ledger system','Operating system','Database system','Network system'], stream: 'Commerce', correct: 0 },
]

// ================= ARTS (10) =================
export const artsQuestions = [
  { id: 'a1', question: 'Which subject studies human behavior and mind?', options: ['Physics','Psychology','Chemistry','Math'], stream: 'Arts', correct: 1 },
  { id: 'a2', question: 'Which field deals with laws and legal systems?', options: ['Engineering','Law','Medicine','Finance'], stream: 'Arts', correct: 1 },
  { id: 'a3', question: 'Which skill is essential for a journalist?', options: ['Coding','Writing & communication','Accounting','Programming'], stream: 'Arts', correct: 1 },
  { id: 'a4', question: 'Which subject focuses on government and political systems?', options: ['Political Science','Biology','Economics','Physics'], stream: 'Arts', correct: 0 },
  { id: 'a5', question: 'A student interested in civil services should prefer?', options: ['Science','Commerce','Arts','Engineering'], stream: 'Arts', correct: 2 },
  { id: 'a6', question: 'Which field involves design, creativity, and visual communication?', options: ['Graphic Design','Accounting','Engineering','Medicine'], stream: 'Arts', correct: 0 },
  { id: 'a7', question: 'Which subject studies past events and civilizations?', options: ['History','Physics','Chemistry','Math'], stream: 'Arts', correct: 0 },
  { id: 'a8', question: 'Which skill is important for public speaking and debates?', options: ['Logical expression','Drawing','Coding','Experimentation'], stream: 'Arts', correct: 0 },
  { id: 'a9', question: 'Which field focuses on social issues and human development?', options: ['Sociology','Physics','Chemistry','Accounting'], stream: 'Arts', correct: 0 },
  { id: 'a10', question: 'Which career involves content creation and storytelling?', options: ['Software Developer','Content Writer','Accountant','Engineer'], stream: 'Arts', correct: 1 },
]

// ================= ALL QUESTIONS =================
export const aptitudeQuestions = [
  ...scienceQuestions,
  ...commerceQuestions,
  ...artsQuestions,
]

// ================= FINAL SCORING =================
export function evaluateAptitude(answers = {}) {
  const scores = {
    Science: 0,
    Commerce: 0,
    Arts: 0,
  }

  const allQuestions = [
    ...scienceQuestions,
    ...commerceQuestions,
    ...artsQuestions,
  ]

  for (const q of allQuestions) {
    const userAnswer = answers[q.id]

    // ✅ ONLY correct answers give score
    if (userAnswer === q.correct) {
      scores[q.stream] += 10
    }
  }

  const bestStream = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0][0]

  return {
    scores,
    bestStream,
    reason: generateReason(scores),
  }
}

// ================= REASON GENERATOR =================
function generateReason(scores) {
  const { Science, Commerce, Arts } = scores

  if (Science > Commerce && Science > Arts) {
    return "You showed strong analytical, problem-solving, and logical thinking skills."
  }

  if (Commerce > Science && Commerce > Arts) {
    return "You demonstrated interest in business, finance, and decision-making skills."
  }

  return "You showed creativity, communication skills, and interest in humanities."
}
export function scoreToProfile(answers = {}) {
  const result = evaluateAptitude(answers)

  return {
    profile:
      result.bestStream === "Science"
        ? "Analytical Builder"
        : result.bestStream === "Commerce"
        ? "Business Strategist"
        : "Creative Thinker",

    streamHint: result.bestStream,
    scores: result.scores,
    reason: result.reason,
    
  }
}
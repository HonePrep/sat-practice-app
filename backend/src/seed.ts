import * as db from './db.js';

async function seed() {
  await db.initDb();
  console.log('Seeding database...');
  db.clearAllData();

  const test1Id = db.generateId();
  db.insertTest(test1Id, 'SAT Practice Test 1', 'Full-length practice test', 'Medium', 3840);

  const section1Id = db.generateId();
  db.insertSection(section1Id, test1Id, 'Reading and Writing', 0, 1920);

  const rwQuestions = [
    { passage: `Moths that fly by day are not properly to be called moths; they do not excite that pleasant sense of dark autumn nights. They are hybrid creatures, neither gay like butterflies nor somber like their own species.`, prompt: 'Which choice best states the main purpose of the passage?', explanation: 'The passage describes a scene prompting reflection.', choices: [{ label: 'A', text: 'To argue moths deserve more appreciation', correct: false }, { label: 'B', text: 'To describe a scene that prompts reflection on nature', correct: true }, { label: 'C', text: 'To compare moths and butterflies', correct: false }, { label: 'D', text: 'To explain scientific classification', correct: false }] },
    { passage: null, prompt: 'The committee members, having reviewed all proposals, _______ to announce their decision.\n\nWhich completes the text correctly?', explanation: 'Plural subject requires "plan".', choices: [{ label: 'A', text: 'plans', correct: false }, { label: 'B', text: 'plan', correct: true }, { label: 'C', text: 'is planning', correct: false }, { label: 'D', text: 'has planned', correct: false }] },
    { passage: null, prompt: 'The experiment yielded unexpected results. _______, the researchers decided to repeat it.\n\nWhich transition fits best?', explanation: 'Consequently shows cause-effect.', choices: [{ label: 'A', text: 'However', correct: false }, { label: 'B', text: 'Meanwhile', correct: false }, { label: 'C', text: 'Consequently', correct: true }, { label: 'D', text: 'Similarly', correct: false }] }
  ];
  rwQuestions.forEach((q, idx) => {
    const qId = db.generateId();
    db.insertQuestion(qId, section1Id, idx, q.prompt, q.passage, q.explanation, 'Medium', '[]');
    q.choices.forEach(c => db.insertChoice(db.generateId(), qId, c.label, c.text, c.correct ? 1 : 0));
  });

  const section2Id = db.generateId();
  db.insertSection(section2Id, test1Id, 'Math', 1, 1920);

  const mathQuestions = [
    { prompt: 'If 3x + 7 = 22, what is 6x + 14?', explanation: '6x+14 = 2(3x+7) = 44', choices: [{ label: 'A', text: '30', correct: false }, { label: 'B', text: '37', correct: false }, { label: 'C', text: '44', correct: true }, { label: 'D', text: '52', correct: false }] },
    { prompt: 'Rectangle has perimeter 56. Length is 4 more than width. What is area?', explanation: 'w=12, l=16, area=192', choices: [{ label: 'A', text: '180', correct: false }, { label: 'B', text: '192', correct: true }, { label: 'C', text: '196', correct: false }, { label: 'D', text: '224', correct: false }] },
    { prompt: 'Right triangle: leg=8, hypotenuse=17. Other leg?', explanation: '8²+b²=17², b=15', choices: [{ label: 'A', text: '9', correct: false }, { label: 'B', text: '12', correct: false }, { label: 'C', text: '15', correct: true }, { label: 'D', text: '16', correct: false }] },
    { prompt: 'x² - 6x + k = 0 has one solution. What is k?', explanation: 'Discriminant=0: 36-4k=0, k=9', choices: [{ label: 'A', text: '-9', correct: false }, { label: 'B', text: '6', correct: false }, { label: 'C', text: '9', correct: true }, { label: 'D', text: '36', correct: false }] }
  ];
  mathQuestions.forEach((q, idx) => {
    const qId = db.generateId();
    db.insertQuestion(qId, section2Id, idx, q.prompt, null, q.explanation, 'Medium', '[]');
    q.choices.forEach(c => db.insertChoice(db.generateId(), qId, c.label, c.text, c.correct ? 1 : 0));
  });

  const test2Id = db.generateId();
  db.insertTest(test2Id, 'Quick Practice: Reading', 'Short 3-question practice', 'Easy', 600);
  const section3Id = db.generateId();
  db.insertSection(section3Id, test2Id, 'Reading', 0, 600);

  const passage = `The printing press transformed Europe. Before Gutenberg, books were hand-copied luxuries. By 1500, 20 million volumes had been printed.`;
  const readingQs = [
    { prompt: 'The passage primarily serves to', choices: [{ label: 'A', text: 'argue printing press was most important', correct: false }, { label: 'B', text: 'describe how printing changed book production', correct: true }, { label: 'C', text: 'compare printing methods', correct: false }, { label: 'D', text: 'criticize medieval technology', correct: false }] },
    { prompt: '"Luxuries" most nearly means', choices: [{ label: 'A', text: 'comforts', correct: false }, { label: 'B', text: 'expensive items', correct: true }, { label: 'C', text: 'artistic works', correct: false }, { label: 'D', text: 'valuable possessions', correct: false }] },
    { prompt: 'The statistic about 20 million volumes serves to', choices: [{ label: 'A', text: 'question records', correct: false }, { label: 'B', text: 'show dramatic increase in production', correct: true }, { label: 'C', text: 'prove everyone could afford books', correct: false }, { label: 'D', text: 'suggest scribes were unnecessary', correct: false }] }
  ];
  readingQs.forEach((q, idx) => {
    const qId = db.generateId();
    db.insertQuestion(qId, section3Id, idx, q.prompt, passage, 'See passage.', 'Easy', '[]');
    q.choices.forEach(c => db.insertChoice(db.generateId(), qId, c.label, c.text, c.correct ? 1 : 0));
  });

  console.log('Done! Created 2 tests with 10 total questions.');
}

seed().catch(console.error);

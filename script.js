"use strict";

/*
 * Course Recommendation Quiz
 * Each answer adds points to a set of "tags". Each course has weights for
 * those tags. A course's match % = points earned / best points possible.
 */

// ---- Data ---------------------------------------------------------------

const QUESTIONS = [
  {
    text: "What is your main goal?",
    options: [
      { label: "Get my first tech job", tags: { job: 3 } },
      { label: "Switch to a new career", tags: { job: 2, switch: 3 } },
      { label: "Build a product or start a business", tags: { build: 3 } },
      { label: "Upgrade skills in my current role", tags: { upskill: 3 } }
    ]
  },
  {
    text: "What is your current background?",
    options: [
      { label: "Student (engineering / computer science)", tags: { tech: 3 } },
      { label: "Student (non-technical field)", tags: { nontech: 3 } },
      { label: "Working professional (technical)", tags: { tech: 2, upskill: 1 } },
      { label: "Working professional (non-technical)", tags: { nontech: 2, upskill: 1 } }
    ]
  },
  {
    text: "What kind of work excites you most?",
    options: [
      { label: "Building websites and apps", tags: { code: 3, web: 3 } },
      { label: "Working with data and finding insights", tags: { data: 3 } },
      { label: "Designing how things look and feel", tags: { design: 3 } },
      { label: "Marketing and growing a brand", tags: { marketing: 3 } },
      { label: "Smart systems and AI", tags: { ai: 3, data: 1, code: 1 } }
    ]
  },
  {
    text: "How comfortable are you with programming?",
    options: [
      { label: "Complete beginner", tags: { beginner: 3 } },
      { label: "I know the basics", tags: { basic: 3 } },
      { label: "Comfortable, I build small projects", tags: { advanced: 3, code: 1 } }
    ]
  },
  {
    text: "How much time can you give each week?",
    options: [
      { label: "Under 5 hours", tags: { light: 3 } },
      { label: "5 to 10 hours", tags: { medium: 3 } },
      { label: "More than 10 hours", tags: { heavy: 3 } }
    ]
  },
  {
    text: "How do you like to learn?",
    options: [
      { label: "Live classes with a mentor", tags: { live: 3 } },
      { label: "Self-paced videos", tags: { selfpaced: 3 } },
      { label: "Hands-on projects", tags: { projects: 3 } }
    ]
  }
];

// Sample catalog (replace with real courses when you have them)
const COURSES = [
  {
    name: "Full Stack Web Development",
    duration: "6 months",
    blurb: "HTML, CSS, JavaScript, databases and deployment, building real web apps end to end.",
    weights: { job: 2, build: 3, tech: 2, code: 3, web: 3, basic: 2, beginner: 1, advanced: 1, heavy: 2, medium: 1, projects: 3, live: 1 }
  },
  {
    name: "Data Analytics with Excel, SQL and Power BI",
    duration: "4 months",
    blurb: "Clean data, query it, and tell the story with dashboards. No heavy coding needed.",
    weights: { job: 3, switch: 3, nontech: 3, data: 3, beginner: 2, basic: 1, medium: 2, light: 1, upskill: 2, live: 1, projects: 2 }
  },
  {
    name: "Python Programming for Beginners",
    duration: "2 months",
    blurb: "Start coding from zero with Python, from basics to small automation projects.",
    weights: { job: 1, switch: 2, nontech: 2, code: 2, beginner: 3, light: 3, medium: 1, selfpaced: 3, upskill: 1 }
  },
  {
    name: "Java and Data Structures for Placements",
    duration: "5 months",
    blurb: "Core Java, DSA and problem solving to crack coding rounds in tech interviews.",
    weights: { job: 3, tech: 3, code: 2, basic: 2, advanced: 2, heavy: 2, medium: 1, live: 3 }
  },
  {
    name: "Digital Marketing and SEO",
    duration: "3 months",
    blurb: "Social media, SEO, ads and analytics to grow a brand or business online.",
    weights: { marketing: 3, build: 2, nontech: 2, switch: 2, upskill: 2, beginner: 2, light: 2, medium: 1, selfpaced: 2, projects: 2 }
  },
  {
    name: "UI/UX Design Essentials",
    duration: "4 months",
    blurb: "Research, wireframes, prototypes and design tools, with a portfolio you can show.",
    weights: { design: 3, switch: 2, nontech: 2, job: 2, beginner: 2, medium: 2, projects: 3, live: 2 }
  },
  {
    name: "AI and Machine Learning Foundations",
    duration: "6 months",
    blurb: "Python, statistics and machine learning models, applied to real datasets.",
    weights: { ai: 3, data: 2, tech: 3, code: 2, advanced: 2, basic: 1, heavy: 3, job: 2, projects: 2 }
  },
  {
    name: "Product and Business Skills for Professionals",
    duration: "3 months",
    blurb: "Product thinking, communication and tools that help you move up in your current role.",
    weights: { upskill: 3, nontech: 2, build: 2, light: 3, selfpaced: 2, beginner: 1, marketing: 1 }
  }
];

// ---- State --------------------------------------------------------------

let current = 0;
let answers = new Array(QUESTIONS.length).fill(null); // chosen option index per question
let lastResults = [];

// ---- DOM ----------------------------------------------------------------

const $ = (id) => document.getElementById(id);
const quizEl = $("quiz");
const resultEl = $("result");
const questionEl = $("question");
const optionsEl = $("options");
const stepEl = $("step");
const barEl = $("bar");
const nextBtn = $("next");
const backBtn = $("back");

// ---- Quiz rendering -----------------------------------------------------

function renderQuestion() {
  const q = QUESTIONS[current];
  questionEl.textContent = q.text;
  stepEl.textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  barEl.style.width = `${(current / QUESTIONS.length) * 100}%`;

  optionsEl.replaceChildren();
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (answers[current] === i ? " selected" : "");
    btn.textContent = opt.label;
    btn.addEventListener("click", () => selectOption(i));
    optionsEl.appendChild(btn);
  });

  backBtn.disabled = current === 0;
  nextBtn.disabled = answers[current] === null;
  nextBtn.textContent = current === QUESTIONS.length - 1 ? "See results" : "Next";
}

function selectOption(i) {
  answers[current] = i;
  renderQuestion();
}

// ---- Scoring ------------------------------------------------------------

function collectTags() {
  const tags = {};
  answers.forEach((choice, qi) => {
    const picked = QUESTIONS[qi].options[choice].tags;
    for (const [tag, pts] of Object.entries(picked)) {
      tags[tag] = (tags[tag] || 0) + pts;
    }
  });
  return tags;
}

function scoreCourses(tags) {
  const scored = COURSES.map((course) => {
    let earned = 0;
    const reasons = [];
    for (const [tag, pts] of Object.entries(tags)) {
      const w = course.weights[tag] || 0;
      if (w > 0) {
        earned += pts * w;
        reasons.push({ tag, value: pts * w });
      }
    }
    return { course, earned, reasons };
  });

  const best = Math.max(...scored.map((s) => s.earned), 1);
  scored.forEach((s) => {
    s.percent = Math.round((s.earned / best) * 100);
  });
  scored.sort((a, b) => b.earned - a.earned);
  return scored.slice(0, 3);
}

const TAG_LABELS = {
  job: "getting a job", switch: "a career switch", build: "building something",
  upskill: "upgrading your skills", tech: "your technical background",
  nontech: "your non-technical background", code: "coding", web: "web development",
  data: "working with data", design: "design", marketing: "marketing", ai: "AI",
  beginner: "starting from scratch", basic: "your basic coding level",
  advanced: "your coding experience", light: "a light weekly schedule",
  medium: "a moderate weekly schedule", heavy: "a high weekly time commitment",
  live: "live mentor-led classes", selfpaced: "self-paced learning", projects: "hands-on projects"
};

function whyText(reasons) {
  const top = reasons.sort((a, b) => b.value - a.value).slice(0, 3).map((r) => TAG_LABELS[r.tag]);
  return top.length ? `Matches your interest in ${top.join(", ")}.` : "";
}

// ---- Results ------------------------------------------------------------

function showResults() {
  lastResults = scoreCourses(collectTags());
  barEl.style.width = "100%";

  const cards = $("cards");
  cards.replaceChildren();
  lastResults.forEach((r, i) => {
    const card = document.createElement("article");
    card.className = "course" + (i === 0 ? " top" : "");

    const h = document.createElement("h3");
    h.textContent = `${i + 1}. ${r.course.name}`;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `Duration: ${r.course.duration}`;
    const p = document.createElement("p");
    p.textContent = r.course.blurb;

    const match = document.createElement("div");
    match.className = "match";
    const label = document.createElement("span");
    label.textContent = `${r.percent}% match`;
    const track = document.createElement("div");
    track.className = "track";
    const fill = document.createElement("div");
    fill.className = "fill";
    fill.style.width = `${r.percent}%`;
    track.appendChild(fill);
    match.append(label, track);

    const why = document.createElement("p");
    why.className = "why";
    why.textContent = whyText(r.reasons);

    card.append(h, meta, p, match, why);
    cards.appendChild(card);
  });

  quizEl.hidden = true;
  resultEl.hidden = false;
}

function summaryText() {
  const lines = ["My course recommendations:"];
  lastResults.forEach((r, i) => lines.push(`${i + 1}. ${r.course.name} (${r.percent}% match)`));
  return lines.join("\n");
}

async function copySummary() {
  const note = $("copied");
  try {
    await navigator.clipboard.writeText(summaryText());
    note.textContent = "Summary copied.";
  } catch {
    note.textContent = "Could not copy automatically. Please select and copy the results.";
  }
  note.hidden = false;
}

// ---- Events -------------------------------------------------------------

nextBtn.addEventListener("click", () => {
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResults();
  }
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

$("restart").addEventListener("click", () => {
  current = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  $("copied").hidden = true;
  resultEl.hidden = true;
  quizEl.hidden = false;
  renderQuestion();
});

$("copy").addEventListener("click", copySummary);

renderQuestion();

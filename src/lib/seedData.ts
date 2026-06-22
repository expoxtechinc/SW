import { News, Activity, QuizQuestion } from "../types";

export const DEFAULT_NEWS: Omit<News, "id">[] = [
  {
    title: "MISS Triumphs in Regional Academic Quiz Bowl",
    content: "Our exceptional Quiz Bowl team has secured first place in the Greater Monrovia High School Academic Championship! Overcoming rigorous STEM and history rounds, our representatives showed stellar knowledge and humanities debate skills, demonstrating why Multee International School System continues to lead in classroom excellence.",
    category: "Quiz Bowl",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Principal's Office"
  },
  {
    title: "Vocational TVET Program Expands with State-Of-The-Art Equipment",
    content: "We are thrilled to announce the arrival of new equipment for our TVET vocational division in Johnsonville. Our programs in Tailoring, Pastry & Baking, Hair Dressing, Beauty Care, Computer Science, and Journalism now feature modern industry tools to prepare our students with competitive technical skills for the Liberian workforce.",
    category: "TVET",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Vocational Director"
  },
  {
    title: "Greenland Community Environmental Day",
    content: "The Senior High student association led a successful community cleaning and tree-planting drive around our Greenland Johnsonville campus. Over 100 students participated, establishing MISS as a pillar of green living and social responsibility in Monrovia.",
    category: "General",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Student Affairs"
  }
];

export const DEFAULT_ACTIVITIES: Omit<Activity, "id">[] = [
  {
    title: "Computer Science Practical lab",
    description: "Students of junior and senior high program learning basic algorithms, web coding, and computing hardware skills for their quarterly exhibitions.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    location: "MISS Tech Wing"
  },
  {
    title: "Journalism Track live broadcast demo",
    description: "TVET Journalism cohort simulating a live radio panel discussion, interviewing the community leaders of Johnsonville on civil development.",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Media Studio"
  },
  {
    title: "Tailoring and Pastry Showcase",
    description: "Annual vocational festival showing exquisite clothing designs made by our tailoring students and delicios delicacies baked by our pastry team.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "MISS Central auditorium"
  }
];

export const DEFAULT_QUIZ_QUESTIONS: Omit<QuizQuestion, "id">[] = [
  {
    subject: "Science (STEM)",
    question: "Which of the following cellular organelles is known as the powerhouse of the cell, responsible for ATP synthesis?",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Endoplasmic Reticulum"],
    answer: "Mitochondrion",
    explanation: "Mitochondria generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
  },
  {
    subject: "History & Social Studies",
    question: "Who was the first female president of Liberia (and Africa), elected in 2005?",
    options: ["Ellen Johnson Sirleaf", "Ruth Sando Perry", "Jewel Howard Taylor", "Angie Brooks"],
    answer: "Ellen Johnson Sirleaf",
    explanation: "Ellen Johnson Sirleaf served as President of Liberia from 2006 to 2018, making her the first elected female head of state in Africa."
  },
  {
    subject: "Math (STEM)",
    question: "If a triangle has sides of length 3 cm and 4 cm, with a 90-degree angle between them, what is the length of the hypotenuse?",
    options: ["5 cm", "6 cm", "7 cm", "25 cm"],
    answer: "5 cm",
    explanation: "According to the Pythagorean theorem (a² + b² = c²), 3² + 4² = 9 + 16 = 25. Therefore, the square root of 25 is 5 cm."
  },
  {
    subject: "Literature",
    question: "Who wrote the famous Liberian literary masterpiece, 'Murder in the Cassava Patch'?",
    options: ["Bai T. Moore", "Wilton G. S. Sankawulo", "Roland T. Dempster", "Kona Khasu"],
    answer: "Bai T. Moore",
    explanation: "Bai T. Moore is one of Liberia's most famous literary figures, who wrote 'Murder in the Cassava Patch' in 1968."
  }
];

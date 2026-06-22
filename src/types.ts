export interface News {
  id: string;
  title: string;
  content: string;
  category: "General" | "Academic" | "TVET" | "Sports" | "Quiz Bowl";
  imageUrl?: string;
  date: string;
  author: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  location?: string;
}

export interface QuizQuestion {
  id: string;
  subject: "Science (STEM)" | "Math (STEM)" | "Humanities" | "History & Social Studies" | "Literature";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email?: string;
  phone: string;
  program: string;
  message: string;
  date: string;
}

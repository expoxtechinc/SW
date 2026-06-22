import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "./firebase";
import { News, Activity, QuizQuestion, Inquiry } from "../types";
import { DEFAULT_NEWS, DEFAULT_ACTIVITIES, DEFAULT_QUIZ_QUESTIONS } from "./seedData";

// Seeding checks to guarantee data is never empty
export async function seedInitialDatabase() {
  try {
    // 1. Seed News
    const newsCol = collection(db, "news");
    const newsSnap = await getDocs(newsCol);
    if (newsSnap.empty) {
      console.log("Seeding default news into Firestore...");
      for (const item of DEFAULT_NEWS) {
        await addDoc(newsCol, item);
      }
    }

    // 2. Seed Activities
    const actCol = collection(db, "activities");
    const actSnap = await getDocs(actCol);
    if (actSnap.empty) {
      console.log("Seeding default activities into Firestore...");
      for (const item of DEFAULT_ACTIVITIES) {
        await addDoc(actCol, item);
      }
    }

    // 3. Seed Quiz Questions
    const quizCol = collection(db, "quiz_questions");
    const quizSnap = await getDocs(quizCol);
    if (quizSnap.empty) {
      console.log("Seeding default quiz questions into Firestore...");
      for (const item of DEFAULT_QUIZ_QUESTIONS) {
        await addDoc(quizCol, item);
      }
    }
  } catch (error) {
    console.warn("Seeding database error (this is safe if security rules prevent writes without authenticating first):", error);
  }
}

// Ensure Admin privilege in /admins/{userId} directory in Firestore
export async function makeUserAdmin(uid: string) {
  try {
    const adminRef = doc(db, "admins", uid);
    await setDoc(adminRef, { adminSince: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("Error setting up admin account record:", error);
    return false;
  }
}

export async function checkIfUserIsAdmin(uid: string): Promise<boolean> {
  try {
    const adminRef = doc(db, "admins", uid);
    const snap = await getDoc(adminRef);
    return snap.exists();
  } catch (error) {
    console.warn("Error checking admin privilege status:", error);
    return false;
  }
}

// 1. Fetch Operations
export function subscribeToNews(callback: (news: News[]) => void) {
  const q = query(collection(db, "news"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items: News[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as News);
    });
    // Fallback to defaults if empty and snapshot is fetched
    if (items.length === 0) {
      callback(DEFAULT_NEWS.map((item, index) => ({ id: `default-${index}`, ...item } as News)));
    } else {
      callback(items);
    }
  }, (err) => {
    console.error("Error listening to news updates:", err);
    // Return static defaults on permission/network error
    callback(DEFAULT_NEWS.map((item, index) => ({ id: `default-${index}`, ...item } as News)));
  });
}

export function subscribeToActivities(callback: (activities: Activity[]) => void) {
  const q = query(collection(db, "activities"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items: Activity[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Activity);
    });
    if (items.length === 0) {
      callback(DEFAULT_ACTIVITIES.map((item, index) => ({ id: `default-act-${index}`, ...item } as Activity)));
    } else {
      callback(items);
    }
  }, (err) => {
    console.error("Error listening to activities updates:", err);
    callback(DEFAULT_ACTIVITIES.map((item, index) => ({ id: `default-act-${index}`, ...item } as Activity)));
  });
}

export function subscribeToQuizQuestions(callback: (questions: QuizQuestion[]) => void) {
  const colRef = collection(db, "quiz_questions");
  return onSnapshot(colRef, (snapshot) => {
    const items: QuizQuestion[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as QuizQuestion);
    });
    if (items.length === 0) {
      callback(DEFAULT_QUIZ_QUESTIONS.map((item, index) => ({ id: `default-quiz-${index}`, ...item } as QuizQuestion)));
    } else {
      callback(items);
    }
  }, (err) => {
    console.error("Error listening to quiz questions updates:", err);
    callback(DEFAULT_QUIZ_QUESTIONS.map((item, index) => ({ id: `default-quiz-${index}`, ...item } as QuizQuestion)));
  });
}

export function subscribeToInquiries(callback: (inquiries: Inquiry[]) => void) {
  const q = query(collection(db, "inquiries"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items: Inquiry[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Inquiry);
    });
    callback(items);
  }, (err) => {
    console.error("Inquiries subscription works for Admin only:", err);
  });
}

// 2. Publish Operations (Admins Only after rules update)
export async function publishNewsItem(news: Omit<News, "id">) {
  const colRef = collection(db, "news");
  return await addDoc(colRef, news);
}

export async function publishActivityItem(act: Omit<Activity, "id">) {
  const colRef = collection(db, "activities");
  return await addDoc(colRef, act);
}

export async function publishQuizQuestionItem(qItem: Omit<QuizQuestion, "id">) {
  const colRef = collection(db, "quiz_questions");
  return await addDoc(colRef, qItem);
}

// 3. Inquiry Submission (Anyone can do)
export async function submitInquiryRequest(inquiry: Omit<Inquiry, "id">) {
  const colRef = collection(db, "inquiries");
  return await addDoc(colRef, inquiry);
}

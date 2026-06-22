import React, { useState, useEffect } from "react";
import { 
  subscribeToNews, 
  subscribeToActivities, 
  subscribeToQuizQuestions,
  seedInitialDatabase
} from "./lib/firestoreService";
import { News, Activity, QuizQuestion } from "./types";
import HomeTab from "./components/HomeTab";
import BoardTab from "./components/BoardTab";
import QuizTab from "./components/QuizTab";
import ApplyTab from "./components/ApplyTab";
import AdminTab from "./components/AdminTab";

import { 
  Home, 
  Radio, 
  GraduationCap, 
  Send, 
  Lock, 
  Award, 
  Cpu, 
  Scissors, 
  Coffee, 
  Newspaper, 
  Sparkles, 
  Phone, 
  BookOpen, 
  ShieldCheck, 
  MessageSquareDot 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [news, setNews] = useState<News[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedVocation, setSelectedVocation] = useState<string | null>(null);

  // Initialize and check database seeding
  useEffect(() => {
    // Run initial seed inside Firestore if empty
    seedInitialDatabase();

    // Setup active listeners to Firestore collection states
    const unsubNews = subscribeToNews((items) => setNews(items));
    const unsubActivities = subscribeToActivities((items) => setActivities(items));
    const unsubQuestions = subscribeToQuizQuestions((items) => setQuestions(items));

    return () => {
      unsubNews();
      unsubActivities();
      unsubQuestions();
    };
  }, []);

  // Sync click events from desktop board to mobile applet screen navigation
  const triggerNavigation = (tabName: string) => {
    setActiveTab(tabName);
    const scrollTarget = document.getElementById("phone_screen_viewport");
    if (scrollTarget) {
      scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="miss_root_wrapper">
      {/* Universal Portal Top Navigation Header with low layout footprint */}
      <header className="bg-white border-b border-gray-100 py-3 px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white font-extrabold font-serif text-lg shadow-sm">
              M
            </span>
            <div>
              <h1 className="text-sm font-black font-sans text-gray-950 tracking-tight flex items-center gap-1.5 leading-none">
                Multee International School System
              </h1>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase font-mono">
                Greenland Community, Johnsonville, Liberia
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-600" /> Firebase Secured DB</span>
            <span className="flex items-center gap-1"><Sparkles size={13} className="text-purple-600 animate-pulse" /> Gemini AI Integrated</span>
          </div>
        </div>
      </header>

      {/* Main Container Dual Pane Shell */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Mobile Phone Device Replica Frame */}
        <div className="lg:col-span-5 flex justify-center w-full" id="phone_mockup_pane">
          <div className="relative w-full max-w-[390px] h-[760px] bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-[6px] border-slate-800 flex flex-col overflow-hidden">
            
            {/* Phone Notch/Island */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-32 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center">
              <div className="h-1.5 w-12 bg-slate-800 rounded-full mb-1" />
            </div>

            {/* Simulated System Status Bar inside Mobile Page */}
            <div className="flex justify-between items-center px-6 pt-2 pb-1.5 bg-white text-[10px] font-bold text-slate-700 select-none z-30 font-mono">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px]">GreenlandMISS</span>
                <span className="h-2 w-3.5 rounded-xs border border-slate-700 relative p-px flex items-center">
                  <span className="h-full w-2.5 bg-slate-700 block rounded-2xs" />
                  <span className="h-1 w-0.5 bg-slate-700 block absolute -right-[2px] top-1/2 -translate-y-1/2" />
                </span>
                <Radio size={10} className="text-emerald-600 animate-pulse" />
              </div>
            </div>

            {/* Screen Inner Container */}
            <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden rounded-t-[28px] relative">
              
              {/* App Internal Header bar */}
              <div className="bg-emerald-800 text-white py-3 px-4 shadow-sm text-left flex items-center justify-between z-20">
                <div>
                  <h2 className="text-[11px] font-black tracking-wider uppercase text-emerald-200 font-sans">Multee Int'l (MISS)</h2>
                  <p className="text-[10px] text-emerald-100 font-semibold opacity-90 leading-none mt-0.5">Academic & Technical Portal</p>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold font-mono">
                  MISS App
                </span>
              </div>

              {/* Viewport content area */}
              <div 
                className="flex-1 overflow-y-auto p-4 scrollbar-none"
                id="phone_screen_viewport"
              >
                {activeTab === "home" && (
                  <HomeTab 
                    onNavigateToTab={triggerNavigation}
                    onSetSelectedVocation={setSelectedVocation}
                  />
                )}
                {activeTab === "board" && (
                  <BoardTab 
                    newsList={news}
                    activityList={activities}
                  />
                )}
                {activeTab === "quiz" && (
                  <QuizTab 
                    quizQuestions={questions}
                  />
                )}
                {activeTab === "apply" && (
                  <ApplyTab />
                )}
                {activeTab === "admin" && (
                  <AdminTab />
                )}
              </div>

              {/* App Bottom Tab navigation bar */}
              <nav className="h-14 bg-white border-t border-gray-100 flex items-center justify-around text-[9px] font-bold text-gray-500 z-20 shadow-lg px-2">
                <button
                  onClick={() => triggerNavigation("home")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "home" ? "text-emerald-700 font-extrabold scale-110" : "hover:text-gray-900"
                  }`}
                  id="nav_btn_home"
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => triggerNavigation("board")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "board" ? "text-emerald-700 font-extrabold scale-110" : "hover:text-gray-900"
                  }`}
                  id="nav_btn_board"
                >
                  <Radio size={16} />
                  <span>Board</span>
                </button>

                <button
                  onClick={() => triggerNavigation("quiz")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "quiz" ? "text-emerald-700 font-extrabold scale-110" : "hover:text-gray-900"
                  }`}
                  id="nav_btn_quiz"
                >
                  <GraduationCap size={16} />
                  <span>Quiz Bowl</span>
                </button>

                <button
                  onClick={() => triggerNavigation("apply")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${
                    activeTab === "apply" ? "text-emerald-700 font-extrabold scale-110" : "hover:text-gray-900"
                  }`}
                  id="nav_btn_apply"
                >
                  <Send size={16} />
                  <span>Inquire</span>
                </button>

                <button
                  onClick={() => triggerNavigation("admin")}
                  className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    activeTab === "admin" ? "text-emerald-700 font-extrabold scale-110" : "hover:text-gray-900"
                  }`}
                  id="nav_btn_admin"
                >
                  <Lock size={16} />
                  <span>Admin</span>
                </button>
              </nav>

            </div>

            {/* Apple Home Indicator Indicator bar */}
            <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 h-1 w-28 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Right Side: High-Fidelity Desktop Descriptive dashboard */}
        <div className="lg:col-span-7 space-y-6 text-left" id="desktop_details_pane">
          <div>
            <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 uppercase">
              Official School System Briefing
            </span>
            <h2 className="mt-2.5 text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              Developing Liberia's Next Generation of Leaders & Vocational Champions
            </h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
              Multee International School System (MISS) in Greenland Community, Johnsonville offers nursery to senior high school curricula. We combine rigorous regional WASSCE exam qualification with real vocational TVET courses to ensure immediate work readiness and economic empowerment.
            </p>
          </div>

          {/* Grid of details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stats Card: Quiz Wins */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Award size={18} />
              </span>
              <h3 className="text-sm font-extrabold text-gray-900">Quiz Bowl Wins & STEM</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                MISS is renowned for previous wins in regional quiz bowl championships and math tournaments. We prepare students for debate, scientific logic, and public speech.
              </p>
              <button
                onClick={() => triggerNavigation("quiz")}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                id="btn_deskt_test_quiz"
              >
                Launch Mock Quiz Practice →
              </button>
            </div>

            {/* Stats Card: Intake Vocationals */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Cpu size={18} />
              </span>
              <h3 className="text-sm font-extrabold text-gray-900">TVET Vocational Division</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We equip Monrovia youth with marketable life-skills: Computer Sciences, Pastry & Catering, Tailoring, Journalism, Hair Styling, and Beauty Care.
              </p>
              <button
                onClick={() => triggerNavigation("home")}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                id="btn_deskt_view_jobs"
              >
                View Vocational Majors →
              </button>
            </div>
          </div>

          {/* Vocational Quick Detail Accordion Sync */}
          {selectedVocation && (
            <div className="rounded-xl bg-emerald-950 p-5 text-white animate-fade-in space-y-2 text-left" id="desktop_selected_vocation_details">
              <span className="text-[10px] bg-white/20 text-emerald-100 font-black px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Active TVET Vocational Major
              </span>
              <h3 className="text-base font-extrabold">{selectedVocation}</h3>
              <p className="text-xs text-emerald-200 max-w-xl">
                The TVET track for {selectedVocation} features daily practical laboratory sessions on our Greenland Campus. 
                Students graduate with a recognized technical certificate, armed with the marketing & freelance styling knowledge critical for Liberia's rapid growth.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-emerald-300">
                <span>📅 Class intake: Sept / Feb</span>
                <span>🎓 Level: Certificate / Diploma</span>
              </div>
            </div>
          )}

          {/* General Admission registration callout */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                <MessageSquareDot size={16} className="text-emerald-600" /> Prospective Student Registration
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-xl">
                Greenland Campus registrations are open for Nursery to High School and Vocational certificates. Inquire today for details on schedules, textbooks, and WASSCE preparations.
              </p>
            </div>
            <button
              onClick={() => triggerNavigation("apply")}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800 transition-all font-sans shrink-0 hover:scale-105"
              id="desktop_admission_trigger"
            >
              Fill Enrollment Inquiry
            </button>
          </div>

          {/* Quick Contact Widget of school */}
          <div className="border-t border-gray-100 pt-5 flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-gray-500">
            <span>📞 Greenland hotline: <strong>+231 77 782 9659</strong></span>
            <span>✉️ Registrar's mail: <strong>multeeschoolsystem@gmail.com</strong></span>
          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-gray-100 py-4 text-center text-[11px] text-gray-400 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 Multee International School System (MISS). All rights reserved. Greenland Community, Monrovia, Liberia.</span>
          <span className="font-semibold text-emerald-800">Designed with pride for MISS.</span>
        </div>
      </footer>
    </div>
  );
}

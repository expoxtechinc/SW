import React, { useState } from "react";
import { QuizQuestion } from "../types";
import { Award, CheckCircle, XCircle, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface QuizTabProps {
  quizQuestions: QuizQuestion[];
}

export default function QuizTab({ quizQuestions }: QuizTabProps) {
  const [currentSubject, setCurrentSubject] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highStreak, setHighStreak] = useState<number>(0);

  // Filter questions based on selected category
  const filteredQuestions = quizQuestions.filter(q => 
    currentSubject === "All" || q.subject === currentSubject
  );

  const currentQuestion = filteredQuestions[currentIndex] || null;

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setScore(prev => prev + 10);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > highStreak) {
        setHighStreak(nextStreak);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back to start
      setCurrentIndex(0);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setCurrentSubject(subject);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const categories = ["All", "Science (STEM)", "Math (STEM)", "Humanities", "History & Social Studies", "Literature"];

  return (
    <div className="space-y-4 text-left animate-fade-in" id="quiz_tab_arena">
      {/* Quiz Bowl Scoreboard */}
      <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-amber-400 animate-pulse" />
          <div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">MISS Quiz Bowl Prep</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-black font-mono text-amber-300">Score: {score}</span>
              <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded-xs font-semibold text-slate-300">
                Streak: {streak} 🔥
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-amber-200/80 block font-semibold uppercase">High Streak</span>
          <span className="text-xs font-bold font-mono text-white">{highStreak} record</span>
        </div>
      </div>

      {/* Category Toggles scrollable */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="quiz_category_filter">
        {categories.map((sub) => (
          <button
            key={sub}
            onClick={() => handleSubjectChange(sub)}
            className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap shrink-0 transition-all ${
              currentSubject === sub
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {sub.replace(" (STEM)", "")}
          </button>
        ))}
      </div>

      {/* Main Question Box */}
      {currentQuestion ? (
        <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-4 shadow-2xs" id="quiz_question_card">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-sm bg-purple-50 px-2 py-0.5 text-[9px] font-bold text-purple-700 uppercase">
              {currentQuestion.subject}
            </span>
            <span className="text-[10px] font-mono text-gray-400 font-bold">
              Q: {currentIndex + 1} / {filteredQuestions.length}
            </span>
          </div>

          <h3 className="text-xs font-extrabold text-gray-900 leading-relaxed min-h-[3rem]">
            {currentQuestion.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-1.5">
            {currentQuestion.options.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i];
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuestion.answer;
              
              let optionStyle = "border-gray-100 hover:bg-slate-50";
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = "border-emerald-500 bg-emerald-50/40 text-emerald-900";
                } else if (isSelected) {
                  optionStyle = "border-rose-500 bg-rose-50/40 text-rose-900";
                } else {
                  optionStyle = "opacity-50 border-gray-100";
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isAnswered}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all text-xs font-medium ${optionStyle}`}
                  id={`quiz_option_${letter}`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black border font-mono ${
                    isAnswered && isCorrect
                      ? "bg-emerald-500 text-white border-transparent"
                      : isAnswered && isSelected
                        ? "bg-rose-500 text-white border-transparent"
                        : isSelected
                          ? "bg-emerald-600 text-white border-transparent"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}>
                    {letter}
                  </span>
                  <span className="leading-tight">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation */}
          {isAnswered && (
            <div className="rounded-lg bg-slate-50 p-3 space-y-1.5 animate-fade-in" id="quiz_feedback_section">
              <div className="flex items-center gap-1.5">
                {selectedAnswer === currentQuestion.answer ? (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700">
                    <CheckCircle size={14} /> Correct (+10 Score)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-rose-700">
                    <XCircle size={14} /> Incorrect Answer
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <span className="font-extrabold text-gray-700">Explanation:</span> {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              className="rounded-md bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800 transition-all flex items-center gap-1.5"
              id="quiz_next_btn"
            >
              {isAnswered ? "Next Question" : "Skip Question"}
              <RefreshCw size={11} className="animate-spin-slow" />
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 text-center py-12 text-gray-400 text-xs">
          <AlertCircle size={24} className="mx-auto text-gray-300 mb-2" />
          No quiz bowl questions found for the selected category.
        </div>
      )}
    </div>
  );
}

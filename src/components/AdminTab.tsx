import React, { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  publishNewsItem, 
  publishActivityItem, 
  publishQuizQuestionItem, 
  subscribeToInquiries,
  makeUserAdmin,
  checkIfUserIsAdmin
} from "../lib/firestoreService";
import { Inquiry, News, QuizQuestion } from "../types";
import { Sparkles, Key, LogOut, PlusCircle, Check, Users, FileText, HelpCircle, Loader2 } from "lucide-react";

export default function AdminTab() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Auth Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tab Choice
  const [adminSection, setAdminSection] = useState<"news" | "questions" | "inquiries">("news");

  // Inquiries List
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // News Publish Inputs
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState<any>("General");
  const [newsImage, setNewsImage] = useState("");
  const [publishingNews, setPublishingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);

  // Quiz Publish Inputs
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizSubject, setQuizSubject] = useState<any>("Science (STEM)");
  const [quizOptions, setQuizOptions] = useState<string[]>(["", "", "", ""]);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizExplanation, setQuizExplanation] = useState("");
  const [publishingQuiz, setPublishingQuiz] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // AI draft helpers
  const [aiTopic, setAiTopic] = useState("");
  const [generatingAiNews, setGeneratingAiNews] = useState(false);
  const [generatingAiQuiz, setGeneratingAiQuiz] = useState(false);
  const [aiError, setAiError] = useState("");

  // Manage Active State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Enforce Firestore admin record check
        const isUserAdmin = await checkIfUserIsAdmin(currentUser.uid);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setCheckingAuth(false);
    });
    return unsub;
  }, []);

  // Subscribe to inquiries if authenticated as Admin
  useEffect(() => {
    if (user && isAdmin) {
      const unsub = subscribeToInquiries((items) => {
        setInquiries(items);
      });
      return unsub;
    }
  }, [user, isAdmin]);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!email || !password) {
      setAuthError("Please enter your email and password.");
      return;
    }

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Make user admin
        await makeUserAdmin(cred.user.uid);
        setIsAdmin(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Quick verify
        const isUserAdmin = await checkIfUserIsAdmin(auth.currentUser?.uid || "");
        setIsAdmin(isUserAdmin);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to authenticate with Firebase.");
    }
  };

  const signInQuickSimulation = async () => {
    setAuthError("");
    setCheckingAuth(true);
    try {
      // Simulate/register a stable developer login for showcase:
      const simEmail = "admin@miss.com";
      const simPassword = "missadmin2026";
      
      let userCred;
      try {
        userCred = await signInWithEmailAndPassword(auth, simEmail, simPassword);
      } catch {
        // If not exists, register it
        userCred = await createUserWithEmailAndPassword(auth, simEmail, simPassword);
        await makeUserAdmin(userCred.user.uid);
      }
      
      const isUserAdmin = await checkIfUserIsAdmin(userCred.user.uid);
      setIsAdmin(isUserAdmin || true); // safe fallback for demo flow
    } catch (err: any) {
      console.error(err);
      setAuthError("Failed to trigger simulation log in.");
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  // AI draft call using backend Express endpoints
  const draftNewsWithGemini = async () => {
    if (!aiTopic) {
      setAiError("Please type a topic for the AI to draft news about.");
      return;
    }
    setGeneratingAiNews(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, category: newsCategory })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setNewsTitle(data.title || "");
      setNewsContent(data.content || "");
      setAiTopic("");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Could not reach Gemini AI news drafting service.");
    } finally {
      setGeneratingAiNews(false);
    }
  };

  const draftQuizWithGemini = async () => {
    setGeneratingAiQuiz(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: quizSubject })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setQuizQuestion(data.question || "");
      if (Array.isArray(data.options)) {
        setQuizOptions(data.options);
      }
      setQuizAnswer(data.answer || "");
      setQuizExplanation(data.explanation || "");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Could not reach Gemini AI quiz drafting service.");
    } finally {
      setGeneratingAiQuiz(false);
    }
  };

  // Publish News Item
  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;

    setPublishingNews(true);
    try {
      await publishNewsItem({
        title: newsTitle,
        content: newsContent,
        category: newsCategory,
        imageUrl: newsImage || undefined,
        date: new Date().toISOString(),
        author: "Admin (" + (user?.email || "Unknown") + ")"
      });
      setNewsSuccess(true);
      setNewsTitle("");
      setNewsContent("");
      setNewsImage("");
      setTimeout(() => setNewsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingNews(false);
    }
  };

  // Publish Quiz bowl Item
  const handlePublishQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion || !quizAnswer) return;

    setPublishingQuiz(true);
    try {
      await publishQuizQuestionItem({
        subject: quizSubject,
        question: quizQuestion,
        options: quizOptions,
        answer: quizAnswer,
        explanation: quizExplanation
      });
      setQuizSuccess(true);
      setQuizQuestion("");
      setQuizOptions(["", "", "", ""]);
      setQuizAnswer("");
      setQuizExplanation("");
      setTimeout(() => setQuizSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingQuiz(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="py-20 text-center text-gray-500 space-y-3">
        <Loader2 className="mx-auto text-emerald-600 animate-spin" size={24} />
        <p className="text-xs">Authenticating with Multee Int'l cluster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left animate-fade-in" id="admin_tab_workspace">
      {!user || !isAdmin ? (
        // Login Portal
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-2xs" id="admin_login_card">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-xs font-bold text-gray-800 tracking-wide uppercase">Admin Login</h2>
              <p className="text-[10px] text-gray-500 mt-1">Access school-wide publishing database & parental enquiries.</p>
            </div>
            <Key className="text-emerald-700" size={16} />
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs" id="form_admin_auth">
            {authError && (
              <div className="rounded-md bg-rose-50 p-2 text-rose-700 text-[10px] font-semibold leading-normal">
                {authError}
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 mb-1">Office Email Address</label>
              <input
                type="email"
                required
                placeholder="office@miss.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-1.5 px-2.5 text-xs outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-1.5 px-2.5 text-xs outline-hidden focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-700 py-2 font-black text-white hover:bg-emerald-800 transition-all cursor-pointer"
            >
              {isSignUp ? "Register Office Admin Account" : "Sign In to Office Panel"}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100/60 flex flex-col gap-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">Want to test instantly?</span>
              <button 
                onClick={signInQuickSimulation}
                className="font-bold text-emerald-700 hover:underline"
                id="btn_simulation_bypass"
              >
                Log in with Simulation Admin Account
              </button>
            </div>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] text-gray-500 font-semibold hover:text-gray-800 text-center block mt-1"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need to register a new admin account? Create here"}
            </button>
          </div>
        </div>
      ) : (
        // Admin Workspace
        <div className="space-y-4" id="admin_authorized_panel">
          {/* Top Panel User Board */}
          <div className="rounded-xl border border-gray-100 bg-slate-900 p-3 text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[8px] bg-emerald-600 px-1.5 py-0.5 rounded-sm font-bold uppercase">MISS Administrator</span>
              <p className="text-[10px] text-slate-300 truncate max-w-[140px] font-mono leading-tight">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:bg-white/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={10} /> Exit
            </button>
          </div>

          {/* Sub Navigation Admin Menu */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setAdminSection("news")}
              className={`flex-1 py-1 px-1.5 text-center text-[10px] font-bold rounded-md flex items-center justify-center gap-1 ${
                adminSection === "news" ? "bg-white text-slate-900 shadow-sm" : "text-gray-500"
              }`}
            >
              <FileText size={10} /> Publish News
            </button>
            <button
              onClick={() => setAdminSection("questions")}
              className={`flex-1 py-1 px-1.5 text-center text-[10px] font-bold rounded-md flex items-center justify-center gap-1 ${
                adminSection === "questions" ? "bg-white text-slate-900 shadow-sm" : "text-gray-500"
              }`}
            >
              <HelpCircle size={10} /> Add Quiz
            </button>
            <button
              onClick={() => setAdminSection("inquiries")}
              className={`flex-1 py-1 px-1.5 text-center text-[10px] font-bold rounded-md flex items-center justify-center gap-1 relative ${
                adminSection === "inquiries" ? "bg-white text-slate-900 shadow-sm" : "text-gray-500"
              }`}
            >
              <Users size={10} /> Inquiry
              {inquiries.length > 0 && (
                <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
          </div>

          {/* Form Actions */}
          {aiError && (
            <div className="rounded-lg bg-rose-50 p-2 text-rose-700 text-[10px] leading-normal font-medium">
              {aiError}
            </div>
          )}

          {adminSection === "news" && (
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 space-y-3.5 shadow-2xs">
              {/* Gemini AI Drafting section in Admin view */}
              <div className="rounded-lg bg-purple-50/50 p-3 border border-purple-100 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-purple-700 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-purple-950">Gemini AI Article Drafter</span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Enter topic: e.g. Pastry Art Grad or Quiz Bow..."
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="flex-1 rounded-md border border-purple-200 bg-white px-2 py-1 text-[10px] outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-500/20"
                  />
                  <button
                    type="button"
                    onClick={draftNewsWithGemini}
                    disabled={generatingAiNews}
                    className="rounded-md bg-purple-700 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-purple-800 disabled:opacity-50 transition-all flex items-center gap-1"
                  >
                    {generatingAiNews ? "Drafting..." : "Draft"}
                  </button>
                </div>
              </div>

              {/* News Publish form */}
              <form onSubmit={handlePublishNews} className="space-y-3 text-xs">
                {newsSuccess && (
                  <div className="rounded-md bg-emerald-50 p-2 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                    <Check size={12} /> News article successfully published to Cloud!
                  </div>
                )}
                
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Category</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white py-1 px-1.5 text-xs outline-hidden"
                  >
                    <option value="General">General News</option>
                    <option value="Academic">Academic Announcement</option>
                    <option value="TVET">TVET Vocation Focus</option>
                    <option value="Quiz Bowl">Quiz Bowl Updates</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Provide a catch headline"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-200 py-1.5 px-2 text-xs outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/example"
                    value={newsImage}
                    onChange={(e) => setNewsImage(e.target.value)}
                    className="w-full rounded-md border border-gray-200 py-1.5 px-2 text-xs outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write detailed school news and curriculum activities"
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="w-full rounded-md border border-gray-200 p-2 text-xs outline-hidden focus:border-emerald-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishingNews}
                  className="w-full rounded-lg bg-emerald-700 py-2.5 font-bold text-white hover:bg-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <PlusCircle size={12} /> {publishingNews ? "Publishing..." : "Publish To Board"}
                </button>
              </form>
            </div>
          )}

          {adminSection === "questions" && (
            <div className="rounded-xl border border-gray-100 bg-white p-3.5 space-y-3.5 shadow-2xs">
              {/* Gemini AI Quiz Generator section in Admin view */}
              <div className="rounded-lg bg-purple-50/50 p-3 border border-purple-100 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-700 animate-pulse" />
                    <span className="text-[10px] font-extrabold text-purple-950">Gemini Quiz Question Generator</span>
                  </div>
                  <button
                    type="button"
                    onClick={draftQuizWithGemini}
                    disabled={generatingAiQuiz}
                    className="rounded-md bg-purple-700 px-3 py-1 text-[10px] font-bold text-white hover:bg-purple-800 disabled:opacity-50 transition-all flex items-center gap-1"
                  >
                    {generatingAiQuiz ? "Generating..." : "Generate Question"}
                  </button>
                </div>
                <p className="text-[9px] text-purple-800/80 leading-snug">
                  Gemini will auto-generate a custom high school Quiz Bowl question according to the currently selected subject dropdown below!
                </p>
              </div>

              {/* Quiz Publish form */}
              <form onSubmit={handlePublishQuiz} className="space-y-3 text-xs">
                {quizSuccess && (
                  <div className="rounded-md bg-emerald-50 p-2 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                    <Check size={12} /> Quiz Question published successfully!
                  </div>
                )}
                
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject Category</label>
                  <select
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    className="w-full rounded-md border border-gray-200 bg-white py-1 px-1.5 text-xs outline-hidden text-gray-800"
                  >
                    <option value="Science (STEM)">Science (STEM)</option>
                    <option value="Math (STEM)">Math (STEM)</option>
                    <option value="Humanities">Humanities</option>
                    <option value="History & Social Studies">History & Social Studies</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Trivia Question</label>
                  <input
                    type="text"
                    required
                    placeholder="Type the quiz question text"
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    className="w-full rounded-md border border-gray-200 py-1.5 px-2 text-xs outline-hidden focus:border-emerald-600"
                  />
                </div>

                {/* Options 1-4 */}
                <div className="space-y-1">
                  <label className="block font-bold text-gray-700">Answer Options (4 Choices)</label>
                  {quizOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      required
                      placeholder={`Option ${["A", "B", "C", "D"][idx]}`}
                      value={opt}
                      onChange={(e) => {
                        const nextOpts = [...quizOptions];
                        nextOpts[idx] = e.target.value;
                        setQuizOptions(nextOpts);
                      }}
                      className="w-full rounded-md border border-gray-200 py-1 px-2 text-xs outline-hidden focus:border-emerald-600"
                    />
                  ))}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Correct Choice</label>
                  <input
                    type="text"
                    required
                    placeholder="Must exactly match one of the options above"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    className="w-full rounded-md border border-gray-200 py-1.5 px-2 text-xs outline-hidden focus:border-emerald-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Explanation</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Explain why this choice is correct for student benefits"
                    value={quizExplanation}
                    onChange={(e) => setQuizExplanation(e.target.value)}
                    className="w-full rounded-md border border-gray-200 p-2 text-xs outline-hidden focus:border-emerald-600 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishingQuiz}
                  className="w-full rounded-lg bg-emerald-700 py-2.5 font-bold text-white hover:bg-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <PlusCircle size={12} /> {publishingQuiz ? "Adding..." : "Add to Quiz Database"}
                </button>
              </form>
            </div>
          )}

          {adminSection === "inquiries" && (
            <div className="space-y-2 animate-fade-in" id="admin_inquiries_manager">
              <h2 className="text-xs font-bold text-gray-800 tracking-wide uppercase px-1">Enquiries Received ({inquiries.length})</h2>
              
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-lg border border-gray-100 bg-white p-3 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-gray-900 text-xs">{inq.name}</span>
                      <span className="text-[8px] bg-slate-100 text-gray-600 px-1.5 py-0.5 rounded-sm font-mono font-bold">
                        {new Date(inq.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500 font-mono">
                      <span>📱 {inq.phone}</span>
                      {inq.email && <span>✉️ {inq.email}</span>}
                    </div>

                    <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-xs w-fit">
                      Interest: {inq.program}
                    </div>

                    <p className="text-[10px] text-gray-600 leading-normal italic bg-slate-50 p-2 rounded-md">
                      "{inq.message}"
                    </p>
                  </div>
                ))}

                {inquiries.length === 0 && (
                  <div className="text-center py-12 rounded-lg border border-dashed border-gray-200 text-gray-400 text-xs">
                    No registry requests or inquiries received yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

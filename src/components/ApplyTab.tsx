import React, { useState } from "react";
import { submitInquiryRequest } from "../lib/firestoreService";
import { Send, CheckCircle2, User, Phone, Mail, Award, BookOpen } from "lucide-react";

export default function ApplyTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState("Vocational TVET: Computer Science");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const programsList = [
    "Vocational TVET: Computer Science",
    "Vocational TVET: Pastry & Baking",
    "Vocational TVET: Tailoring & Fashion",
    "Vocational TVET: Journalism & Media",
    "Vocational TVET: Hair Dressing",
    "Vocational TVET: Beauty Care",
    "Academics: Senior High School (Grades 10-12)",
    "Academics: Junior High School (Grades 7-9)",
    "Academics: Elementary School",
    "Academics: Nursery & Pre-School Program"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setErrorMsg("Please fill out Name, Phone Number, and your Message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await submitInquiryRequest({
        name,
        email: email || undefined,
        phone,
        program,
        message,
        date: new Date().toISOString()
      });

      // Show success screen
      setIsSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Failed to submit inquiry to Firestore. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-left animate-fade-in" id="apply_tab_container">
      {isSuccess ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 text-center space-y-4 animate-fade-in" id="apply_success_panel">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-emerald-950">Inquiry Successfully Sent!</h2>
            <p className="text-[11px] text-emerald-800/80 mt-1.5 leading-relaxed">
              Thank you for choosing Multee International School. The registrar office of MISS Greenland Campus will contact you by phone shortly.
            </p>
          </div>
          <button
            onClick={() => setIsSuccess(false)}
            className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-all font-sans"
          >
            Submit Another Query
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-2xs" id="apply_form_panel">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-xs font-bold text-gray-800 tracking-wide uppercase">Admissions & Vocation Intake</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Submit questions about academic slots, fees, or TVET programs:</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs" id="intake_form">
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 p-2.5 text-[10px] text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Student/Guardian Name */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                  <User size={12} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marie Mulbah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-1.5 pl-7 pr-3 text-xs outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Contact Phone Number *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400 font-mono">
                  <Phone size={12} />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +231 77 782 9659"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-1.5 pl-7 pr-3 text-xs outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email (Optional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-400">
                  <Mail size={12} />
                </span>
                <input
                  type="email"
                  placeholder="e.g. student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-1.5 pl-7 pr-3 text-xs outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Program Interest */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Program of Interest</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-1.5 px-2 text-xs outline-hidden focus:border-emerald-600"
              >
                {programsList.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Inquiry details *</label>
              <textarea
                required
                rows={3}
                placeholder="Ask about registration fees, school timing, or certification..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-black text-white hover:bg-emerald-800 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              id="submit_intake_btn"
            >
              {isSubmitting ? "Submitting Request..." : "Send Inquiry Request"}
              <Send size={11} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { BookOpen, Award, AwardIcon, Phone, Mail, MapPin, Cpu, Coffee, Scissors, Newspaper, Sparkles } from "lucide-react";

interface HomeTabProps {
  onNavigateToTab: (tab: string) => void;
  onSetSelectedVocation: (vocation: string | null) => void;
}

export default function HomeTab({ onNavigateToTab, onSetSelectedVocation }: HomeTabProps) {
  const [activeTrack, setActiveTrack] = useState<"academics" | "tvet">("tvet");
  const [selectedVocationDetail, setSelectedVocationDetail] = useState<string | null>(null);

  const tvetPrograms = [
    {
      name: "Computer Science",
      desc: "Coding, hardware diagnostics & digital literacy.",
      icon: Cpu,
      color: "from-blue-500 to-indigo-600",
      jobOutlook: "Software Assistant, IT Support, cybercafé operator.",
      duration: "9 Months Certificate"
    },
    {
      name: "Pastry & Baking",
      desc: "Professional baking, dessert design, catering arts.",
      icon: Coffee,
      color: "from-amber-400 to-orange-500",
      jobOutlook: "Local Bakery Owner, Catering Assistant, Pastry Chef.",
      duration: "6 Months Certificate"
    },
    {
      name: "Tailoring & Fashion",
      desc: "African attire styling, garment construction, design.",
      icon: Scissors,
      color: "from-rose-500 to-pink-600",
      jobOutlook: "Professional Tailor, Boutique Stylist, Garment Maker.",
      duration: "12 Months Diploma"
    },
    {
      name: "Journalism & Media",
      desc: "Radio broadcast, print reporting & digital publishing.",
      icon: Newspaper,
      color: "from-teal-500 to-emerald-600",
      jobOutlook: "Community Radio Reporter, Correspondent, Media Intern.",
      duration: "9 Months Certificate"
    },
    {
      name: "Hair Dressing",
      desc: "Modern hairstyling, braiding techniques & salon arts.",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
      jobOutlook: "Salon Stylist, Hair Consultant, Salon Entrepreneur.",
      duration: "6 Months Certificate"
    },
    {
      name: "Beauty Care",
      desc: "Skincare, cosmetics application & aesthetic therapy.",
      icon: Sparkles,
      color: "from-fuchsia-400 to-pink-500",
      jobOutlook: "Cosmetics Specialist, Makeup Artist, Spa Consultant.",
      duration: "6 Months Certificate"
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in" id="home_tab_container">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-emerald-700 to-emerald-900 p-5 text-white shadow-md">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
        <span className="inline-flex items-center rounded-sm bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-emerald-300">
          Liberia's Pride
        </span>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight">Multee International</h1>
        <p className="text-xs text-emerald-200 mt-1 max-w-[90%]">
          Nursery to Senior High & Vocational TVET Education. Championing minds in Greenland Community, Johnsonville.
        </p>
        <button 
          onClick={() => onNavigateToTab("apply")}
          className="mt-3 inline-flex items-center gap-1 rounded-sm bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 transition-all hover:bg-emerald-50 shadow-xs hover:scale-105 active:scale-95"
          id="btn_apply_now_hero"
        >
          Enroll / Apply Now
        </button>
      </div>

      {/* Stats Quick Read */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div onClick={() => onNavigateToTab("quiz")} className="cursor-pointer rounded-lg border border-emerald-100 bg-emerald-50/50 p-2 text-emerald-900 hover:bg-emerald-50 transition-all">
          <Award className="mx-auto text-emerald-600 mb-0.5" size={18} />
          <p className="text-[10px] font-bold">Quiz Bowl</p>
          <p className="text-[9px] text-gray-500 font-mono">Champions</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-2 text-emerald-900">
          <BookOpen className="mx-auto text-emerald-600 mb-0.5" size={18} />
          <p className="text-[10px] font-bold">Nursery - HS</p>
          <p className="text-[9px] text-gray-500 font-mono">Liberia Curriculum</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-2 text-emerald-900">
          <Cpu className="mx-auto text-emerald-600 mb-0.5" size={18} />
          <p className="text-[10px] font-bold">6 TVET</p>
          <p className="text-[9px] text-gray-500 font-mono">Vocation Majors</p>
        </div>
      </div>

      {/* Program Division Section */}
      <div>
        <div className="flex border-b border-gray-100 mb-3">
          <button
            onClick={() => setActiveTrack("tvet")}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all ${
              activeTrack === "tvet"
                ? "border-emerald-600 text-emerald-700 font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            id="tab_tvet_trigger"
          >
            TVET Vocational (6 Careers)
          </button>
          <button
            onClick={() => setActiveTrack("academics")}
            className={`flex-1 py-1.5 text-center text-xs font-bold border-b-2 transition-all ${
              activeTrack === "academics"
                ? "border-emerald-600 text-emerald-700 font-extrabold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            id="tab_academics_trigger"
          >
            Nursery - Senior High
          </button>
        </div>

        {activeTrack === "tvet" && (
          <div className="space-y-2 animate-fade-in" id="tvet_grid">
            <p className="text-[11px] text-gray-500 leading-relaxed mb-1">
              Skill-up for the workforce. Select any vocational program below to trigger detailed requirements & job placements in Liberia:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {tvetPrograms.map((program) => {
                const IconComp = program.icon;
                return (
                  <div
                    key={program.name}
                    onClick={() => {
                      setSelectedVocationDetail(
                        selectedVocationDetail === program.name ? null : program.name
                      );
                      onSetSelectedVocation(program.name);
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 text-left relative ${
                      selectedVocationDetail === program.name
                        ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                    id={`vocation_${program.name.replace(/\s+/g, '').toLowerCase()}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                        <IconComp size={14} />
                      </span>
                      <h3 className="text-xs font-bold text-gray-800 leading-tight">{program.name}</h3>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-snug">{program.desc}</p>
                    
                    {selectedVocationDetail === program.name && (
                      <div className="mt-2 pt-2 border-t border-emerald-100 space-y-1 text-[9px] animate-fade-in text-gray-600">
                        <div className="flex justify-between"><span className="font-semibold text-emerald-800">Duration:</span> {program.duration}</div>
                        <div className="leading-normal"><span className="font-semibold text-emerald-800">Careers:</span> {program.jobOutlook}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTrack === "academics" && (
          <div className="rounded-lg border border-gray-100 p-3 bg-white space-y-3 text-left leading-relaxed text-xs text-gray-600 animate-fade-in" id="academic_syllabus">
            <div>
              <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Senior High School Division (Grades 10-12)
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 pl-3">
                Full preparation for the WASSCE regional examinations with deep focus on STEM (Physics, Biology, Chemistry, Advanced Math) and regional Humanities.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Junior High School (Grades 7-9)
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 pl-3">
                Developing critical reasoning, general sciences, social studies & speech debate skills.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-xs flex items-center gap-1.5 text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Elementary & Nursery (Early Learning)
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 pl-3">
                Providing solid numeracy, speech, reading structure, moral discipline & social engagement.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Campus Location & Contacts */}
      <div className="rounded-lg border border-gray-100 p-3 bg-white space-y-2 text-left text-xs" id="contact_tile">
        <h2 className="font-bold text-gray-800 text-xs text-emerald-800 mb-1">Greenland Johnsonville Campus</h2>
        
        <div className="grid grid-cols-1 gap-1.5 text-[11px] text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-emerald-600 shrink-0" />
            <span>Greenland Community, Johnsonville road, Monrovia</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-emerald-600 shrink-0" />
            <a href="tel:+231777829659" className="hover:underline font-semibold font-mono text-gray-800">+231 77 782 9659</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-emerald-600 shrink-0" />
            <a href="mailto:multeeschoolsystem@gmail.com" className="hover:underline font-mono text-gray-800">multeeschoolsystem@gmail.com</a>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
          <span>Principal: J. Mulbah</span>
          <span>Open: Mon - Fri (8:00 AM - 3:30 PM)</span>
        </div>
      </div>
    </div>
  );
}

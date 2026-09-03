import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Header({ onToggleMenu, onOpenVoice, cropName = "Wheat" }) {
  const { user } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Date: e.g. "28 August 2026, Thursday"
      const dateOptions = { day: "numeric", month: "long", year: "numeric", weekday: "long" };
      setDateStr(now.toLocaleDateString("en-IN", dateOptions));

      // Time: e.g. "09:15 AM"
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTimeStr(`${String(hours).padStart(2, "0")}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) return t.greetingAfternoon || "Good Afternoon";
    if (hour >= 17) return t.greetingEvening || "Good Evening";
    return t.greetingMorning || "Good Morning";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Dynamic Greeting */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleMenu}
          className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Toggle Navigation"
        >
          <i className="fa-solid fa-bars text-lg"></i>
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
            {getGreeting()},{" "}
            <span className="text-emerald-700">{user?.name || "Ramesh Kumar"}</span>! 👋
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Today is your <strong className="text-slate-700 font-semibold">{cropName}</strong> procurement day.
          </p>
        </div>
      </div>

      {/* Right: Language Pill, Voice Pill, Notifications, Live Clock */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Pill */}
        <div className="relative hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 rounded-full text-slate-700 transition-colors">
          <i className="fa-solid fa-globe text-emerald-600 text-xs"></i>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-3"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down text-[9px] text-slate-400 pointer-events-none absolute right-2.5"></i>
        </div>

        {/* Voice Pill */}
        <button
          onClick={onOpenVoice}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95"
          title="Voice Assistant"
        >
          <i className="fa-solid fa-microphone text-emerald-600"></i>
          <span className="hidden sm:inline">Voice</span>
        </button>

        {/* Notification Pill */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95"
          title="Notifications"
        >
          <i className="fa-regular fa-bell text-sm"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
            3
          </span>
        </button>

        {/* Live Date & Time */}
        <div className="hidden lg:flex flex-col items-end pl-2 border-l border-slate-200">
          <span className="text-[11px] text-slate-400 font-medium leading-tight">{dateStr}</span>
          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 leading-tight">
            <i className="fa-regular fa-clock text-emerald-600 text-[11px]"></i>
            {timeStr}
          </span>
        </div>
      </div>
    </header>
  );
}

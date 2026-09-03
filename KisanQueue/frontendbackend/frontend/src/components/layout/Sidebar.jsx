import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Sidebar({ isOpen, onClose, onOpenProfile, onOpenVoice }) {
  const { user } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: t.dashboard, icon: "fa-solid fa-house" },
    { path: "/book-slot", label: t.book, icon: "fa-regular fa-calendar-plus" },
    { path: "/my-turn", label: t.queue, icon: "fa-solid fa-users" },
    { path: "/my-produce", label: t.produce, icon: "fa-solid fa-wheat-awn" },
    { path: "/procurement-status", label: t.procurement, icon: "fa-solid fa-clipboard-check" },
    { path: "/payments", label: t.payments, icon: "fa-regular fa-credit-card" },
    { path: "/notifications", label: t.notifications, icon: "fa-regular fa-bell", badge: 3 },
    { action: "voice", label: t.voice, icon: "fa-solid fa-microphone", sub: "Tap to speak" },
    { path: "/help-support", label: t.support, icon: "fa-solid fa-headset", sub: "Get help" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#094220] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {/* Brand */}
          <div className="flex items-center justify-between px-2 pt-2 pb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/90 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-950/40">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                  Kisan<span className="text-emerald-400">Queue</span>
                </h1>
                <p className="text-[11px] text-emerald-200/80 font-medium mt-1 tracking-wide">
                  Smart Procurement for Farmers
                </p>
              </div>
            </div>
            {/* Close button on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item, idx) => {
              if (item.action === "voice") {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onClose?.();
                      onOpenVoice?.();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emerald-100/90 hover:text-white hover:bg-white/10 transition-all text-left group"
                  >
                    <div className="w-6 text-center text-base text-emerald-300 group-hover:scale-110 transition-transform">
                      <i className={item.icon}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold block truncate leading-snug">{item.label}</span>
                      {item.sub && <span className="text-[10px] text-emerald-300/70 block leading-tight">{item.sub}</span>}
                    </div>
                  </button>
                );
              }

              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold"
                      : "text-emerald-100/90 hover:text-white hover:bg-white/10 font-medium"
                  }`}
                >
                  <div className={`w-6 text-center text-base ${isActive ? "text-white" : "text-emerald-300 group-hover:scale-110 transition-transform"}`}>
                    <i className={item.icon}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm block truncate leading-snug">{item.label}</span>
                    {item.sub && <span className="text-[10px] text-emerald-300/70 block leading-tight">{item.sub}</span>}
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-400 text-amber-950 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Sidebar Language Dropdown */}
            <div className="pt-2 px-1">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-emerald-950/40 rounded-xl border border-emerald-800/40 text-emerald-200">
                <i className="fa-solid fa-globe text-emerald-400 text-sm"></i>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-emerald-300/70 block leading-none">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full cursor-pointer mt-0.5"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang} value={lang} className="text-slate-900 bg-white">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <i className="fa-solid fa-chevron-down text-[10px] text-emerald-400"></i>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Section: Profile Card & Tractor Scenery Artwork */}
        <div className="p-3 pt-0 space-y-2">
          {/* Profile Card */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/15 rounded-2xl cursor-pointer border border-white/10 transition-all group"
            title="Click for Profile & Logout"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-400/30 border border-emerald-300/40 flex items-center justify-center text-lg text-emerald-200 font-bold overflow-hidden shadow-inner">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="flex-1 min-w-0">
              <strong className="text-sm font-bold text-white block truncate leading-tight">
                {user?.name || "Ramesh Kumar"}
              </strong>
              <span className="text-[11px] text-emerald-200/80 block truncate">
                {user?.mobile ? `+91 ${user.mobile}` : `ID: ${user?.farmerId || "F1001"}`}
              </span>
            </div>
            <i className="fa-solid fa-chevron-right text-xs text-emerald-300/70 group-hover:translate-x-0.5 transition-transform"></i>
          </div>

          {/* Rural Agricultural Scenery Illustration SVG */}
          <div className="rounded-2xl overflow-hidden border border-emerald-800/30 shadow-inner bg-[#e8f5ec]">
            <svg viewBox="0 0 270 95" preserveAspectRatio="none" className="w-full h-20 block">
              <defs>
                <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#bce3c5" />
                  <stop offset="100%" stopColor="#9bd4a7" />
                </linearGradient>
                <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#80c68d" />
                  <stop offset="100%" stopColor="#46a058" />
                </linearGradient>
                <linearGradient id="fieldStripes" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2c893f" />
                  <stop offset="100%" stopColor="#186b29" />
                </linearGradient>
              </defs>
              <rect width="270" height="95" fill="#e8f5ec" />
              <path d="M0 55 Q 70 25 150 42 T 270 38 L 270 95 L 0 95 Z" fill="url(#hillGrad1)" opacity="0.85" />
              <circle cx="150" cy="35" r="9" fill="#67ab73" />
              <circle cx="160" cy="32" r="12" fill="#4d9b5c" />
              <circle cx="171" cy="36" r="8" fill="#67ab73" />
              <rect x="159" y="44" width="3" height="10" fill="#5c4033" />
              <path d="M0 50 Q 110 38 190 60 T 270 52 L 270 95 L 0 95 Z" fill="url(#hillGrad2)" />
              <path d="M0 72 Q 90 55 200 75 L 270 72 L 270 95 L 0 95 Z" fill="url(#fieldStripes)" />
              <line x1="20" y1="95" x2="90" y2="68" stroke="#3da050" strokeWidth="2" />
              <line x1="60" y1="95" x2="130" y2="70" stroke="#3da050" strokeWidth="2" />
              <line x1="110" y1="95" x2="165" y2="72" stroke="#3da050" strokeWidth="2" />
              {/* Green Tractor Vector */}
              <g transform="translate(105, 46) scale(0.58)">
                <rect x="10" y="16" width="28" height="16" rx="3" fill="#1b8535" />
                <rect x="18" y="6" width="18" height="12" rx="2" fill="#2eb04f" />
                <rect x="22" y="8" width="12" height="7" rx="1" fill="#c3ebff" />
                <rect x="12" y="2" width="2" height="14" fill="#333" />
                <circle cx="34" cy="30" r="12" fill="#2d3748" />
                <circle cx="34" cy="30" r="8" fill="#cbd5e1" />
                <circle cx="34" cy="30" r="3" fill="#2d3748" />
                <circle cx="10" cy="34" r="7" fill="#2d3748" />
                <circle cx="10" cy="34" r="4" fill="#cbd5e1" />
                <circle cx="10" cy="34" r="2" fill="#2d3748" />
              </g>
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/common/EmptyState";

export default function Notifications() {
  const { selectedCentre } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: "queue",
      icon: "fa-bell",
      iconBg: "bg-amber-100 text-amber-700",
      title: "Your turn is approaching (A-018)",
      desc: `Only 5 farmers remain ahead of you at ${selectedCentre}. Prepare to arrive at Weighbridge Gate 2.`,
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      category: "queue",
      icon: "fa-calendar-check",
      iconBg: "bg-blue-100 text-blue-700",
      title: "Procurement Slot Confirmed",
      desc: `Your appointment is registered at ${selectedCentre} for slot 10:00 AM - 11:00 AM.`,
      time: "15 mins ago",
      read: false,
    },
    {
      id: 3,
      category: "payments",
      icon: "fa-indian-rupee-sign",
      iconBg: "bg-emerald-100 text-emerald-700",
      title: "Government MSP Advisory Active",
      desc: "Wheat Minimum Support Price (MSP) rate set to ₹2,275 per quintal. Electronic bank settlement active.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      category: "queue",
      icon: "fa-location-dot",
      iconBg: "bg-slate-100 text-slate-700",
      title: "Mandi Gate Advisory",
      desc: `${selectedCentre} traffic is normal. Entry gate pass scanner active for all tokens.`,
      time: "2 days ago",
      read: true,
    },
  ]);

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notifications & Mandi Advisories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Official announcements, queue movements, and payment updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Mark all read
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 max-w-3xl mx-auto">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          {[
            { id: "all", label: "All Updates" },
            { id: "queue", label: "Queue & Tokens" },
            { id: "payments", label: "DBT Payments" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="fa-bell"
            title="No notifications in this filter"
            description="You are completely up to date. You will receive alerts when your queue token moves."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  n.read
                    ? "bg-white border-slate-200/70"
                    : "bg-emerald-50/40 border-emerald-200/80 shadow-xs"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base flex-shrink-0 shadow-xs ${n.iconBg}`}>
                  <i className={`fa-solid ${n.icon}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <strong className={`text-xs sm:text-sm font-bold block ${n.read ? "text-slate-800" : "text-emerald-950"}`}>
                      {n.title}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HelpSupport() {
  const { selectedCentre } = useAuth();
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How do I know my token position and when to leave home?",
      a: "Your token and the number of farmers ahead of you update in real time on the Dashboard and 'My Turn' section. The 'When Should I Leave?' card computes your travel time and suggests the best departure moment so you don't wait in long queues at the mandi.",
    },
    {
      q: "When will I receive my produce payment after delivery?",
      a: "Once your produce completes Quality Check and Weighing at the mandi, the electronic settlement is initiated via the Public Financial Management System (PFMS) directly into your Aadhaar-linked bank account within 24 to 48 hours.",
    },
    {
      q: "What should I do if I am running late for my booked time slot?",
      a: "KisanQueue reserves your token registration. If you arrive past your exact hour slot, the duty officer will accommodate your vehicle at the next available weighbridge opening without canceling your entry.",
    },
    {
      q: "What documents do I need to bring to the mandi centre?",
      a: "Please carry your original Aadhaar Card and a photocopy or passbook copy of your registered bank account for fast verification at the security check-in bay.",
    },
    {
      q: "What happens if my crop moisture content is above 12%?",
      a: "If moisture exceeds 12%, the mandi provides solar drying yards where you can dry your grain batch before final electronic weighment to avoid price deductions.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Help & Kisan Support Helpline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            24x7 farmer assistance for procurement, mandi procedures, and technical queries.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start sm:self-auto"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Dashboard</span>
        </button>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="tel:18001801551"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-inner">
            <i className="fa-solid fa-phone-volume"></i>
          </div>
          <div>
            <strong className="text-sm font-extrabold text-slate-900 block leading-tight">
              National Kisan Call Centre
            </strong>
            <span className="text-base font-black text-emerald-700 font-mono block mt-1">
              1800-180-1551
            </span>
            <small className="text-[11px] text-slate-400 block">Toll Free (6:00 AM - 10:00 PM Daily)</small>
          </div>
        </a>

        <a
          href="tel:+919876543210"
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-inner">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <strong className="text-sm font-extrabold text-slate-900 block leading-tight">
              {selectedCentre} Helpdesk
            </strong>
            <span className="text-base font-black text-slate-800 font-mono block mt-1">
              +91 98765 43210
            </span>
            <small className="text-[11px] text-slate-400 block">Direct Mandi Gate Officer</small>
          </div>
        </a>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-4">
          Frequently Asked Questions (FAQ)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <strong className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.q}
                  </strong>
                  <i
                    className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  ></i>
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

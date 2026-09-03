import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function CentreModal({ isOpen, onClose }) {
  const { selectedCentre, setSelectedCentre } = useAuth();

  if (!isOpen) return null;

  const centres = [
    {
      id: "Centre A, Bhagalpur",
      title: "Centre A, Bhagalpur",
      desc: "Main Agricultural Mandi (Distance: 4.8 km)",
      badge: "Primary Hub",
    },
    {
      id: "Centre B, Sabour",
      title: "Centre B, Sabour",
      desc: "State Warehouse Complex (Distance: 8.2 km)",
      badge: "Buffer Store",
    },
    {
      id: "Centre C, Nathnagar",
      title: "Centre C, Nathnagar",
      desc: "Cooperative Depot (Distance: 11.5 km)",
      badge: "Fast Track",
    },
  ];

  const handleSelect = (centreId) => {
    setSelectedCentre(centreId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Select Procurement Centre</h3>
        <p className="text-sm text-slate-500 mb-5">
          Choose a government agricultural procurement mandi near you:
        </p>

        <div className="space-y-3">
          {centres.map((c) => {
            const isSelected = selectedCentre === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900">{c.title}</strong>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {c.badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">{c.desc}</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    isSelected ? "text-emerald-600 font-bold" : "text-slate-300"
                  }`}
                >
                  <i className={`fa-solid ${isSelected ? "fa-circle-check" : "fa-circle"}`}></i>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

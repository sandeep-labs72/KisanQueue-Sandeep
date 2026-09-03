import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Large Avatar */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-emerald-50 shadow-inner">
          <i className="fa-solid fa-user-check"></i>
        </div>

        <h3 className="text-xl font-bold text-slate-900">{user?.name || "Farmer"}</h3>
        <p className="text-xs font-bold text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-full mt-1 mb-6 border border-emerald-200">
          Farmer ID: {user?.farmerId || "F1001"}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-600 mb-6">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Mobile Number:</span>
            <strong className="text-slate-800 font-semibold">{user?.mobile || "Not specified"}</strong>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Village / District:</span>
            <strong className="text-slate-800 font-semibold">{user?.village || "Bhagalpur"}, {user?.district || "Bihar"}</strong>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">KYC Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <i className="fa-solid fa-circle-check text-xs"></i>
              <span>Active & Verified</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout from KisanQueue</span>
        </button>
      </div>
    </div>
  );
}

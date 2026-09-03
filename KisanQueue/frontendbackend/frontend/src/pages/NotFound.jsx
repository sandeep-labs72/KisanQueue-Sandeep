import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-inner">
        <i className="fa-solid fa-seedling"></i>
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

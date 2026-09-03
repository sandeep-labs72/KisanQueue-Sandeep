import React from "react";

export default function ErrorCard({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-6 shadow-sm">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
        <i className="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message || "Failed to load data from backend server."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
        >
          <i className="fa-solid fa-arrows-rotate"></i>
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

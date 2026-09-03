import React from "react";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon = "fa-wheat-awn",
  title = "No information available",
  description = "There are no active records in the centralized procurement database.",
  actionText,
  actionLink,
  onAction,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
      {actionLink && actionText && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
        >
          <span>{actionText}</span>
          <i className="fa-solid fa-arrow-right text-xs"></i>
        </Link>
      )}
      {onAction && actionText && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

import React from "react";

export default function LoadingSpinner({ message = "Loading details from mandi system..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
          <i className="fa-solid fa-leaf text-sm animate-pulse"></i>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 tracking-wide">{message}</p>
    </div>
  );
}

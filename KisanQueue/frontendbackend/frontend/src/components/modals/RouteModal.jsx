import React from "react";

export default function RouteModal({ isOpen, onClose, centreName = "Centre A, Bhagalpur", leaveTime = "10:50 AM" }) {
  if (!isOpen) return null;

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centreName)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Route to Procurement Centre</h3>
        <p className="text-sm text-slate-500 mb-5">
          Fastest mandi transit route from your village to <strong className="text-slate-800">{centreName}</strong>
        </p>

        {/* Mock Navigation Map Visual */}
        <div className="relative h-44 bg-gradient-to-br from-emerald-50 via-slate-100 to-emerald-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-between px-8 mb-5">
          {/* Curved road line */}
          <div className="absolute inset-x-8 top-1/2 h-2.5 bg-slate-300 rounded-full -translate-y-1/2">
            <div className="h-full bg-emerald-500 rounded-full w-2/3"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-11 h-11 bg-white shadow-md border border-slate-200 text-emerald-600 rounded-full flex items-center justify-center text-lg">
              <i className="fa-solid fa-house"></i>
            </div>
            <span className="mt-2 text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-md shadow-sm">Village</span>
          </div>

          <div className="relative z-10 flex flex-col items-center animate-bounce">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-base shadow-lg shadow-emerald-600/30">
              <i className="fa-solid fa-car-side"></i>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-11 h-11 bg-red-500 text-white rounded-full flex items-center justify-center text-lg shadow-md shadow-red-500/20">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <span className="mt-2 text-xs font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-md shadow-sm">Mandi</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Distance</span>
            <strong className="text-sm font-bold text-slate-800">4.8 km</strong>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Travel Time</span>
            <strong className="text-sm font-bold text-slate-800">18 mins</strong>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Traffic</span>
            <strong className="text-sm font-bold text-emerald-600">Clear</strong>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] font-medium text-slate-400 block uppercase">Leave At</span>
            <strong className="text-sm font-bold text-emerald-700">{leaveTime}</strong>
          </div>
        </div>

        <button
          onClick={handleOpenGoogleMaps}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98"
        >
          <i className="fa-solid fa-map-location-dot"></i>
          <span>Open in Google Maps</span>
        </button>
      </div>
    </div>
  );
}

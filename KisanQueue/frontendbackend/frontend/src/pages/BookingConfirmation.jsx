import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking || (() => {
    const saved = localStorage.getItem("kisanBooking");
    return saved ? JSON.parse(saved) : null;
  })();

  if (!booking) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Recent Booking Found</h3>
        <p className="text-xs text-slate-500 mb-4">Please book a slot first to view the confirmation slip.</p>
        <button
          onClick={() => navigate("/book-slot")}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
        >
          Go to Slot Booking
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl text-center relative overflow-hidden">
        {/* Top green accent strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
          <i className="fa-solid fa-check"></i>
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Confirmed Successfully!</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Your appointment has been registered at the centralized procurement server.
        </p>

        {/* Token Badge */}
        <div className="my-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 inline-block w-full max-w-xs shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
            YOUR TOKEN NUMBER
          </span>
          <span className="text-4xl font-black text-emerald-900 font-mono tracking-wider block mt-0.5">
            {booking.token || "A-018"}
          </span>
        </div>

        {/* Details Table */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5 mb-8">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Booking ID:</span>
            <strong className="text-slate-800 font-mono font-semibold">{booking.bookingId}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Procurement Centre:</span>
            <strong className="text-slate-800 font-semibold">{booking.centre}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Crop:</span>
            <strong className="text-slate-800 font-semibold">{booking.crop}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Quantity:</span>
            <strong className="text-slate-800 font-semibold">{booking.quantity}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-400">Procurement Date:</span>
            <strong className="text-slate-800 font-semibold">{booking.date}</strong>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Time Slot:</span>
            <strong className="text-emerald-700 font-bold">{booking.time}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <i className="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/my-turn")}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98"
          >
            <i className="fa-solid fa-users"></i>
            <span>View My Turn</span>
          </button>
        </div>
      </div>
    </div>
  );
}

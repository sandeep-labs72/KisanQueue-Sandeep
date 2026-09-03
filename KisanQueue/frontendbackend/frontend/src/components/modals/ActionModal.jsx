import React, { useState } from "react";

export default function ActionModal({ isOpen, onClose, actionType, centreName = "Centre A, Bhagalpur" }) {
  const [messageText, setMessageText] = useState("");
  const [sentNotice, setSentNotice] = useState(false);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (actionType) {
      case "call":
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Call Procurement Centre</h3>
            <p className="text-sm text-slate-500 mb-5">
              Direct official assistance from mandi managers and duty officers at <strong className="text-slate-800">{centreName}</strong>.
            </p>
            <div className="space-y-3 mb-6">
              <a
                href="tel:18001801551"
                className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                  <i className="fa-solid fa-phone-volume"></i>
                </div>
                <div>
                  <strong className="text-sm text-emerald-950 block">National Kisan Call Centre (Toll Free)</strong>
                  <span className="text-xs text-emerald-700 font-semibold">1800-180-1551 (6:00 AM - 10:00 PM)</span>
                </div>
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 bg-slate-700 text-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <strong className="text-sm text-slate-900 block">{centreName} Helpdesk Officer</strong>
                  <span className="text-xs text-slate-600 font-semibold">+91 98765 43210</span>
                </div>
              </a>
            </div>
            <p className="text-[11px] text-slate-400">Available Monday through Saturday for gate pass, weighing, and token support.</p>
          </div>
        );

      case "message":
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Message Centre Officer</h3>
            <p className="text-sm text-slate-500 mb-4">
              Send an inquiry regarding vehicle arrival or quality inspection at <strong className="text-slate-800">{centreName}</strong>.
            </p>
            {sentNotice ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold text-center my-4">
                <i className="fa-solid fa-circle-check text-emerald-600 text-lg mb-1 block"></i>
                Message transmitted successfully to Mandi Control Desk!
              </div>
            ) : (
              <div>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your query regarding gate timing, crop moisture test, or vehicle parking..."
                  rows={4}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all mb-4 resize-none"
                />
                <button
                  onClick={() => {
                    if (messageText.trim()) {
                      setSentNotice(true);
                      setTimeout(() => {
                        setSentNotice(false);
                        setMessageText("");
                        onClose();
                      }, 1800);
                    }
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-98"
                >
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  <span>Send Message</span>
                </button>
              </div>
            )}
          </div>
        );

      case "farmers":
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Farmers Community at Mandi</h3>
            <p className="text-sm text-slate-500 mb-4">
              Real-time updates shared by fellow farmers currently on-site at <strong className="text-slate-800">{centreName}</strong>:
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900">Suraj Singh (Tractor 402)</span>
                  <span className="text-[11px] text-slate-400">10 mins ago</span>
                </div>
                <p className="text-xs text-slate-600">
                  🌾 Weighbridge 2 is moving quickly right now. Moisture testing lab has 2 queues open.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900">Manoj Prasad</span>
                  <span className="text-[11px] text-slate-400">35 mins ago</span>
                </div>
                <p className="text-xs text-slate-600">
                  Gate clearance verification takes 3 minutes. Keep your Aadhaar photocopy ready.
                </p>
              </div>
            </div>
          </div>
        );

      case "learn":
      default:
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Procurement Guide & Rules</h3>
            <p className="text-sm text-slate-500 mb-4">
              Mandatory government requirements for MSP grain procurement:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
                <span>Moisture content must remain below 12% by weight for full grade acceptance.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
                <span>Inorganic foreign matter must not exceed 0.75% of total sampled weight.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
                <span>Carry original Aadhaar card and active bank passbook / verification document.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
                <span>Direct Benefit Transfer (DBT) is credited via PFMS within 24 to 48 hours.</span>
              </li>
            </ul>
          </div>
        );
    }
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
        {renderContent()}
      </div>
    </div>
  );
}

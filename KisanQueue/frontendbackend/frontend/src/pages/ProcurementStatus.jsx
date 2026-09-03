import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const STAGES = [
  { id: "BOOKED", label: "Booked", icon: "fa-ticket" },
  { id: "CHECKED_IN", label: "Checked-In", icon: "fa-id-card" },
  { id: "WAITING", label: "Waiting", icon: "fa-clock" },
  { id: "PROCESSING", label: "Processing", icon: "fa-gears" },
  { id: "QUALITY_CHECK", label: "Quality Check", icon: "fa-vial-circle-check" },
  { id: "WEIGHING", label: "Weighing", icon: "fa-scale-balanced" },
  { id: "COMPLETED", label: "Completed", icon: "fa-circle-check" },
];

const STAGE_DETAILS = {
  BOOKED: {
    title: "Slot Booked Successfully",
    desc: "Your procurement slot is confirmed in the centralized database. Please arrive on time at designated gate.",
  },
  CHECKED_IN: {
    title: "Security Gate Entry Verified",
    desc: "Farmer entry logged at mandi gate. Aadhaar and vehicle registration verification completed.",
  },
  WAITING: {
    title: "Positioned in Inspection Queue",
    desc: "Produce vehicle is lined up in inspection bay. Awaiting laboratory quality technician.",
  },
  PROCESSING: {
    title: "Produce Inspection in Progress",
    desc: "Quality inspection samples collected for grain analysis and moisture percentage test.",
  },
  QUALITY_CHECK: {
    title: "Quality Check Underway",
    desc: "Moisture content and Fair Average Quality (FAQ) parameters being measured in certified test bay.",
  },
  WEIGHING: {
    title: "Electronic Weighbridge Weighing",
    desc: "Gross and tare weight measured electronically. Digital weighment slip generated with barcode.",
  },
  COMPLETED: {
    title: "Procurement Successfully Completed",
    desc: "Produce accepted into Central Pool stock. Electronic Direct Benefit Transfer (DBT) initiated.",
  },
};

export default function ProcurementStatus() {
  const { currentBookingId } = useAuth();
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState("QUALITY_CHECK");
  const [token, setToken] = useState("A-018");
  const [loading, setLoading] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!currentBookingId) {
      // Check saved localStorage
      const saved = localStorage.getItem("kisanBooking");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setToken(parsed.token || "A-018");
        } catch (e) {}
      }
      return;
    }

    try {
      setLoading(true);
      const res = await api.getProcurementStatus(currentBookingId);
      if (res && res.success && res.data) {
        setCurrentStage(res.data.procurementStatus || "QUALITY_CHECK");
        if (res.data.token) setToken(res.data.token);
      }
    } catch (err) {
      console.warn("Procurement fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentBookingId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleAdvanceStage = async () => {
    const stageIds = STAGES.map((s) => s.id);
    const currIdx = stageIds.indexOf(currentStage);
    const nextIdx = (currIdx + 1) % stageIds.length;
    const nextStage = stageIds[nextIdx];

    setAdvancing(true);

    if (currentBookingId) {
      try {
        const res = await api.updateProcurementStatus(currentBookingId, nextStage);
        if (res && res.success) {
          setCurrentStage(nextStage);
        } else {
          setCurrentStage(nextStage);
        }
      } catch (err) {
        setCurrentStage(nextStage);
      }
    } else {
      setCurrentStage(nextStage);
    }

    setTimeout(() => setAdvancing(false), 500);
  };

  const currentIdx = STAGES.findIndex((s) => s.id === currentStage);
  const stageInfo = STAGE_DETAILS[currentStage] || STAGE_DETAILS.QUALITY_CHECK;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Procurement Workflow Status
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your produce through mandatory verification and weighbridge stages.
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

      {/* 7-Stage Horizontal Stepper Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        {/* Token and current info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Token</span>
            <strong className="text-2xl font-black text-emerald-800 font-mono block">{token}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceStage}
              disabled={advancing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
            >
              <i className={`fa-solid ${advancing ? "fa-spinner fa-spin" : "fa-forward-step"}`}></i>
              <span>Advance Stage (Demo Simulation)</span>
            </button>
            <button
              onClick={fetchStatus}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95"
              title="Refresh Status"
            >
              <i className={`fa-solid fa-arrows-rotate ${loading ? "fa-spin" : ""}`}></i>
            </button>
          </div>
        </div>

        {/* 7-Stage Stepper Component */}
        <div className="overflow-x-auto py-4">
          <div className="flex items-center min-w-[650px] justify-between px-2">
            {STAGES.map((s, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <React.Fragment key={s.id}>
                  {/* Node */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base transition-all duration-300 ${
                        isCurrent
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-110 ring-4 ring-emerald-100"
                          : isPast
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    <span
                      className={`mt-2.5 text-xs text-center font-bold tracking-tight ${
                        isCurrent ? "text-emerald-800" : isPast ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {idx < STAGES.length - 1 && (
                    <div className="flex-1 h-1.5 mx-2 rounded-full overflow-hidden bg-slate-200">
                      <div
                        className={`h-full transition-all duration-500 ${
                          idx < currentIdx ? "bg-emerald-500 w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Current Stage Description Callout */}
        <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 border border-emerald-200/80 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              {currentStage}
            </span>
            <h3 className="text-base font-extrabold text-slate-900">{stageInfo.title}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">{stageInfo.desc}</p>
        </div>
      </div>
    </div>
  );
}

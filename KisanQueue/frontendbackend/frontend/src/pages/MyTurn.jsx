import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function MyTurn() {
  const { user, selectedCentre, currentBookingId } = useAuth();
  const navigate = useNavigate();

  const [token, setToken] = useState("A-018");
  const [farmersAhead, setFarmersAhead] = useState(6);
  const [waitTime, setWaitTime] = useState(42);
  const [nowServing, setNowServing] = useState("A-012");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueueData = useCallback(async () => {
    try {
      const farmerId = user?.farmerId || "F1001";
      const qRes = await api.getFarmerQueue(farmerId);

      if (qRes && qRes.success && qRes.data) {
        setToken(qRes.data.token || "A-018");
        const ahead = typeof qRes.data.farmersAhead === "number" ? qRes.data.farmersAhead : 6;
        setFarmersAhead(ahead);
        setWaitTime(ahead > 0 ? ahead * 7 : 0);
      } else {
        const saved = localStorage.getItem("kisanBooking");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setToken(parsed.token || "A-018");
            const ahead = typeof parsed.queueAhead === "number" ? parsed.queueAhead : 6;
            setFarmersAhead(ahead);
            setWaitTime(ahead * 7);
          } catch (e) {}
        }
      }

      const centreRes = await api.getCentreQueue(selectedCentre);
      if (centreRes && centreRes.success && centreRes.data) {
        if (centreRes.data.nowServing) {
          setNowServing(centreRes.data.nowServing);
        }
      }
    } catch (err) {
      console.warn("Queue fetch error:", err);
    }
  }, [user?.farmerId, selectedCentre]);

  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQueueData();
    setTimeout(() => setRefreshing(false), 600);
  };

  const progressPercent = Math.max(10, Math.min(100, 100 - farmersAhead * 12));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Live Queue Tracking</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time queue progression and automated turn prediction for {selectedCentre}.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spotlight Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                YOUR ASSIGNED TOKEN
              </span>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-all active:scale-95"
              >
                <i className={`fa-solid fa-arrows-rotate ${refreshing ? "fa-spin text-emerald-600" : ""}`}></i>
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </button>
            </div>

            <div className="bg-gradient-to-b from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl py-8 text-center my-4 shadow-inner">
              <span className="text-5xl sm:text-6xl font-black text-emerald-800 font-mono tracking-wider block">
                {token}
              </span>
            </div>

            <div className="text-center my-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {farmersAhead === 0 ? "You Are Next In Line!" : "Token Active in Queue"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {farmersAhead === 0
                  ? "Please proceed immediately to Weighbridge Gate 2."
                  : `${farmersAhead} farmers are currently ahead of you.`}
              </p>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden my-4 border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Spotlight 3-Stats Row */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/70 p-3 rounded-2xl text-center mt-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Now Serving</span>
                <strong className="text-sm font-black text-emerald-800 font-mono block mt-0.5">{nowServing}</strong>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ahead</span>
                <strong className="text-sm font-black text-slate-800 block mt-0.5">{farmersAhead}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Wait</span>
                <strong className="text-sm font-black text-emerald-700 block mt-0.5">
                  {farmersAhead === 0 ? "0m" : `${waitTime}m`}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Registry Table Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Queue Registry at Mandi</h3>
                <p className="text-xs text-slate-400 mt-0.5">Active electronic tokens registered today</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Gate Bay 2 Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-3">Token</th>
                    <th className="pb-3 px-3">Farmer Name</th>
                    <th className="pb-3 px-3">Crop</th>
                    <th className="pb-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{nowServing}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">Mahendra Singh</td>
                    <td className="py-3 px-3 text-slate-500">Wheat</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Serving Now
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">A-015</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">Sanjay Yadav</td>
                    <td className="py-3 px-3 text-slate-500">Wheat</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Waiting
                      </span>
                    </td>
                  </tr>
                  {/* Current Authenticated Farmer Row */}
                  <tr className="bg-emerald-50/80 border-l-4 border-emerald-600 font-semibold">
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-900">{token}</td>
                    <td className="py-3.5 px-3 text-emerald-950">
                      {user?.name || "Ramesh Kumar"} <span className="text-[10px] text-emerald-600 font-bold">(You)</span>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-900">Wheat</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                        Your Turn Next
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">A-021</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">Dharmendra Choudhary</td>
                    <td className="py-3 px-3 text-slate-500">Rice / Paddy</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Waiting
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">A-024</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">Anand Prakash</td>
                    <td className="py-3 px-3 text-slate-500">Maize</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Waiting
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

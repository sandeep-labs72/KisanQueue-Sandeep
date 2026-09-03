import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";

export default function Dashboard() {
  const { user, selectedCentre, currentBookingId, setCurrentBookingId } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { openRoute, openCentre, openAction } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("A-018");
  const [farmersAhead, setFarmersAhead] = useState(6);
  const [waitTime, setWaitTime] = useState(42);
  const [nextStage, setNextStage] = useState("Quality Check");
  const [cropName, setCropName] = useState("Wheat");
  const [servingToken, setServingToken] = useState("A-012");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [leaveTime, setLeaveTime] = useState("10:50 AM");
  const [arrivalTime, setArrivalTime] = useState("11:20 AM");

  // Calculate leave & arrival times dynamically
  const calculateTimes = (waitMins) => {
    const now = new Date();
    const travelMins = 18;
    const bufferMins = 10;
    const targetArrival = new Date(now.getTime() + (waitMins > 0 ? waitMins : 30) * 60000);
    const targetDeparture = new Date(targetArrival.getTime() - (travelMins + bufferMins) * 60000);

    const fmt = (d) => {
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, "0");
      const ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${String(h).padStart(2, "0")}:${m} ${ap}`;
    };

    setLeaveTime(fmt(targetDeparture));
    setArrivalTime(fmt(targetArrival));
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const farmerId = user?.farmerId || "F1001";

      // 1. Fetch Farmer Queue Status
      const queueRes = await api.getFarmerQueue(farmerId);
      let aheadCount = 6;
      let userToken = "A-018";
      let activeBookingId = currentBookingId;

      if (queueRes && queueRes.success && queueRes.data) {
        userToken = queueRes.data.token || "A-018";
        aheadCount = typeof queueRes.data.farmersAhead === "number" ? queueRes.data.farmersAhead : 6;
        activeBookingId = queueRes.data.bookingId || activeBookingId;
        if (activeBookingId) setCurrentBookingId(activeBookingId);
      } else {
        // Check saved localStorage booking
        const saved = localStorage.getItem("kisanBooking");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            userToken = parsed.token || userToken;
            aheadCount = typeof parsed.queueAhead === "number" ? parsed.queueAhead : aheadCount;
            if (parsed.crop) setCropName(parsed.crop);
          } catch (e) {}
        }
      }

      setToken(userToken);
      setFarmersAhead(aheadCount);
      const computedWait = aheadCount > 0 ? aheadCount * 7 : 0;
      setWaitTime(computedWait);
      calculateTimes(computedWait);

      // 2. Fetch Centre Status
      const centreRes = await api.getCentreQueue(selectedCentre);
      if (centreRes && centreRes.success && centreRes.data) {
        if (centreRes.data.nowServing) {
          setServingToken(centreRes.data.nowServing);
        }
      }

      // 3. Fetch Procurement Status for active booking
      if (activeBookingId) {
        const procRes = await api.getProcurementStatus(activeBookingId);
        if (procRes && procRes.success && procRes.data) {
          const stg = procRes.data.procurementStatus;
          const stageMap = {
            BOOKED: "Gate Check-In",
            CHECKED_IN: "Waiting Bay Entry",
            WAITING: "Inspector Review",
            PROCESSING: "Quality Check",
            QUALITY_CHECK: "Quality Check",
            WEIGHING: "Electronic Weighing",
            COMPLETED: "Procurement Completed",
          };
          if (stageMap[stg]) setNextStage(stageMap[stg]);
        }

        const bookRes = await api.getBooking(activeBookingId);
        if (bookRes && bookRes.success && bookRes.data) {
          if (bookRes.data.crop) setCropName(bookRes.data.crop);
        }
      }
    } catch (err) {
      console.warn("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.farmerId, selectedCentre, currentBookingId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Listen to Update Speech Synthesis
  const handleListenUpdate = () => {
    const farmerName = user?.name || "Ramesh Kumar";
    const text = `Namaste ${farmerName}. Your procurement token is ${token} at ${selectedCentre}. There are ${farmersAhead} farmers ahead of you. Estimated wait time is ${waitTime} minutes. Recommended departure time is ${leaveTime}.`;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(text);
    }
  };

  // 8-Segment Progress Bar calculation
  const totalSegments = 8;
  const filledCount = Math.max(1, Math.min(totalSegments, totalSegments - Math.floor(farmersAhead / 2)));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* =========================================================
         TOP ROW: 3 MAJOR CARDS (MATCHING REFERENCE DASHBOARD)
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* CARD 1: YOUR TURN STATUS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                YOUR TURN STATUS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot-anim"></span>
                Live Update
              </span>
            </div>

            {/* Big Token Display */}
            <div className="bg-gradient-to-b from-emerald-50/80 to-emerald-100/40 border border-emerald-200/70 rounded-2xl py-5 text-center my-2 shadow-inner">
              <span className="text-5xl font-black text-emerald-800 tracking-wider block font-mono">
                {token}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mt-4">
              <i className="fa-solid fa-user-group text-emerald-600"></i>
              <span>{farmersAhead === 0 ? "You are next in line!" : `${farmersAhead} farmers ahead of you`}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <i className="fa-regular fa-clock text-emerald-600"></i>
              <span>Estimated wait time:</span>
              <strong className="text-slate-800 font-bold">{farmersAhead === 0 ? "Now" : `${waitTime} mins`}</strong>
            </div>

            {/* 8-Segment Progress Bar */}
            <div className="grid grid-cols-8 gap-1.5 my-4">
              {Array.from({ length: totalSegments }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all ${
                    idx < filledCount ? "bg-emerald-500 shadow-xs" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* Advisory Box */}
            <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
              <i className="fa-regular fa-bell text-amber-600 text-sm"></i>
              <span>
                We will notify you{" "}
                <strong className="font-bold text-amber-950">{Math.max(1, farmersAhead - 1)} farmers</strong> before your turn.
              </span>
            </div>
          </div>

          {/* Listen to Update Button */}
          <button
            onClick={handleListenUpdate}
            className="mt-5 w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
          >
            <i className={`fa-solid ${isSpeaking ? "fa-volume-high fa-bounce text-emerald-600" : "fa-volume-high text-emerald-600"}`}></i>
            <span>{isSpeaking ? "Playing Voice Update..." : t.listenUpdate || "Listen to Update"}</span>
          </button>
        </div>

        {/* CARD 2: WHEN SHOULD I LEAVE? */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                WHEN SHOULD I LEAVE?
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <i className="fa-solid fa-car-side"></i>
                <i className="fa-solid fa-tree text-xs"></i>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 text-center my-2">
              <span className="text-xs text-slate-400 font-medium block">{t.leaveAt || "You should leave at"}</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 my-1 font-mono tracking-tight">
                {leaveTime}
              </div>
              <span className="text-xs text-slate-500 font-medium block">{t.toReachOnTime || "to reach on time"}</span>
            </div>

            {/* Travel Metrics List */}
            <div className="space-y-2 mt-4 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-emerald-600"></i>
                  {t.distanceToCentre || "Distance to Centre"}
                </span>
                <strong className="text-slate-800 font-bold">4.8 km</strong>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <i className="fa-solid fa-car-side text-emerald-600"></i>
                  {t.travelTime || "Travel Time"}
                </span>
                <strong className="text-slate-800 font-bold">18 mins</strong>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <i className="fa-regular fa-clock text-emerald-600"></i>
                  {t.queueBuffer || "Queue Buffer"}
                </span>
                <strong className="text-slate-800 font-bold">10 mins</strong>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-xs">
              <span className="text-emerald-900 font-medium">{t.recArrival || "Recommended arrival"}:</span>
              <strong className="text-emerald-700 font-bold">{arrivalTime}</strong>
            </div>
          </div>

          <button
            onClick={openRoute}
            className="mt-5 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98"
          >
            <i className="fa-solid fa-location-arrow"></i>
            <span>{t.viewRoute || "View Route"}</span>
          </button>
        </div>

        {/* COLUMN 3: STACKED CARDS */}
        <div className="flex flex-col gap-5">
          {/* CARD 3A: TODAY'S NEXT STEP */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                TODAY'S NEXT STEP
              </span>
              <i className="fa-solid fa-wheat-awn text-emerald-600 text-sm"></i>
            </div>

            <div className="flex items-start gap-3 my-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                <i className="fa-solid fa-wheat-awn"></i>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                After reaching the centre, you will proceed for{" "}
                <strong className="text-slate-900 font-bold">{nextStage}</strong> for{" "}
                <span className="text-emerald-700 font-semibold">{cropName}</span> produce.
              </p>
            </div>

            <button
              onClick={() => navigate("/procurement-status")}
              className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors self-start"
            >
              <span>View Full Process</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>

          {/* CARD 3B: SMART WAIT */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                SMART WAIT
              </span>
              <span className="text-lg">😌</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Your expected turn around</span>
              <div className="text-2xl font-black text-slate-800 my-0.5 font-mono tracking-tight">
                {arrivalTime}
              </div>
              <p className="text-xs text-slate-500 leading-normal mt-1">
                The queue is steady right now. You can comfortably wait at home.
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 font-medium">
              <i className="fa-regular fa-bell text-emerald-600"></i>
              <span>
                We will remind you to leave at <strong className="text-slate-800 font-bold">{leaveTime}</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
         MIDDLE ROW: QUICK ACTIONS & NOTICE BANNER
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions (4 Tiles) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
            QUICK ACTIONS
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => openAction("call")}
              className="p-4 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-200 rounded-2xl text-left transition-all group shadow-xs active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <i className="fa-solid fa-phone"></i>
              </div>
              <strong className="text-xs font-bold text-slate-900 block leading-tight">Call Centre</strong>
              <small className="text-[10px] text-slate-500 block mt-0.5">Call for Support</small>
            </button>

            <button
              onClick={() => openAction("message")}
              className="p-4 bg-slate-50 hover:bg-orange-50/70 border border-slate-200/80 hover:border-orange-200 rounded-2xl text-left transition-all group shadow-xs active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-base mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <i className="fa-solid fa-message"></i>
              </div>
              <strong className="text-xs font-bold text-slate-900 block leading-tight">Message Centre</strong>
              <small className="text-[10px] text-slate-500 block mt-0.5">Send Message</small>
            </button>

            <button
              onClick={() => openAction("farmers")}
              className="p-4 bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 rounded-2xl text-left transition-all group shadow-xs active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-base mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <i className="fa-solid fa-users"></i>
              </div>
              <strong className="text-xs font-bold text-slate-900 block leading-tight">Other Farmers</strong>
              <small className="text-[10px] text-slate-500 block mt-0.5">Talk to Farmers</small>
            </button>

            <button
              onClick={() => openAction("learn")}
              className="p-4 bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-200 rounded-2xl text-left transition-all group shadow-xs active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <strong className="text-xs font-bold text-slate-900 block leading-tight">Learn More</strong>
              <small className="text-[10px] text-slate-500 block mt-0.5">Guide & Info</small>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg shadow-amber-600/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <strong className="text-sm font-bold block leading-tight mb-1">
                {selectedCentre} is very busy today.
              </strong>
              <p className="text-xs text-amber-100 leading-normal">
                Wait times may be higher due to heavy grain unloads.
              </p>
            </div>
          </div>

          <button
            onClick={openCentre}
            className="mt-4 py-2.5 px-4 bg-white hover:bg-amber-50 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 self-start"
          >
            <span>Check Other Centres</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* =========================================================
         BOTTOM ROW: RECENT NOTIFICATIONS & LIVE QUEUE TRACK
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              RECENT NOTIFICATIONS
            </h3>
            <button
              onClick={() => navigate("/notifications")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-bell"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs font-bold text-slate-900 block truncate leading-tight">
                  Your turn is approaching. ({token})
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  We will notify you when 5 farmers are ahead of you.
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">2m ago</span>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs font-bold text-slate-900 block truncate leading-tight">
                  Slot booked successfully
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {selectedCentre} (10:00 AM - 11:00 AM)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">15m ago</span>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs font-bold text-slate-900 block truncate leading-tight">
                  Payment calculated at MSP ₹2,275 / Qtl
                </strong>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Direct Benefit Transfer active upon weighing completion.
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">1d ago</span>
            </div>
          </div>
        </div>

        {/* Live Queue at Centre */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 truncate">
                LIVE QUEUE AT {selectedCentre.toUpperCase()}
              </h3>
              <button
                onClick={() => navigate("/my-turn")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                View Full Queue
              </button>
            </div>

            {/* 3-Column Stats Box */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center mb-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Now Serving</span>
                <strong className="text-base font-black text-emerald-800 font-mono block mt-0.5">{servingToken}</strong>
                <small className="text-[10px] text-slate-400 block truncate">Active Mandi Bay</small>
              </div>
              <div className="border-x border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Farmers Ahead</span>
                <strong className="text-base font-black text-slate-800 block mt-0.5">{farmersAhead}</strong>
                <small className="text-[10px] text-slate-400 block truncate">In Front of You</small>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Wait</span>
                <strong className="text-base font-black text-emerald-700 block mt-0.5">
                  {farmersAhead === 0 ? "Now" : `${waitTime}m`}
                </strong>
                <small className="text-[10px] text-slate-400 block truncate">Approximate</small>
              </div>
            </div>

            {/* Visual Queue Avatars Track */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Queue Progress</span>
              <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 px-1">
                {Array.from({ length: 16 }).map((_, i) => {
                  const isYou = i === 10;
                  const isPast = i < 10;

                  return (
                    <div key={i} className="flex flex-col items-center flex-shrink-0">
                      {isYou && (
                        <span className="text-[9px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full mb-1">
                          You
                        </span>
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                          isYou
                            ? "bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 shadow-md scale-110"
                            : isPast
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <i className="fa-solid fa-user text-[10px]"></i>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1 font-mono">
                <span>Start: A-001</span>
                <span>End: A-024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

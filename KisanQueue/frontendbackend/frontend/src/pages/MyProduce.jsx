import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import EmptyState from "../components/common/EmptyState";

export default function MyProduce() {
  const { user, selectedCentre, currentBookingId } = useAuth();
  const navigate = useNavigate();

  const [crop, setCrop] = useState("Wheat (Kalyan Sona)");
  const [quantity, setQuantity] = useState(50);
  const [centre, setCentre] = useState(selectedCentre);
  const [hasBooking, setHasBooking] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (currentBookingId) {
        const res = await api.getBooking(currentBookingId);
        if (res && res.success && res.data) {
          setCrop(res.data.crop || crop);
          setQuantity(res.data.quantity || quantity);
          setCentre(res.data.centreId || selectedCentre);
          setHasBooking(true);
          return;
        }
      }

      // Check localStorage
      const saved = localStorage.getItem("kisanBooking");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCrop(parsed.crop || crop);
          setQuantity(parseInt(parsed.quantity, 10) || quantity);
          setCentre(parsed.centre || selectedCentre);
          setHasBooking(true);
        } catch (e) {}
      }
    }
    loadData();
  }, [currentBookingId, selectedCentre]);

  const mspPerKg = 22.75;
  const valuation = Math.round(quantity * mspPerKg);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Produce & MSP Valuation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registered agricultural produce batches and procurement valuation.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Produce Batch Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-slate-900">Active Produce Batch</h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Registered for Procurement
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Crop & Variety:</span>
                <strong className="text-slate-900 font-bold text-sm">{crop}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Registered Quantity:</span>
                <strong className="text-slate-900 font-bold text-sm">{quantity} kg</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Designated Mandi Centre:</span>
                <strong className="text-slate-800 font-semibold">{centre}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Government MSP Rate:</span>
                <strong className="text-slate-800 font-semibold">₹2,275 / Quintal (₹22.75 / kg)</strong>
              </div>

              {/* Highlighted Valuation Box */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between my-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                    Total Estimated Valuation
                  </span>
                  <small className="text-[10px] text-emerald-600 block">Direct Benefit Transfer Amount</small>
                </div>
                <strong className="text-2xl font-black text-emerald-800 font-mono">
                  ₹{valuation.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              onClick={() => navigate("/book-slot")}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98"
            >
              <i className="fa-regular fa-calendar-plus"></i>
              <span>Book Another Batch</span>
            </button>
            <button
              onClick={() => navigate("/procurement-status")}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <i className="fa-solid fa-clipboard-check"></i>
              <span>View Mandi Status</span>
            </button>
          </div>
        </div>

        {/* Quality Standards Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-slate-900">
                Fair Average Quality (FAQ) Standards
              </h3>
              <span className="text-xs font-bold text-slate-500">Official FCI Guidelines</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5"></i>
                <div>
                  <strong className="text-slate-900 block font-semibold">Moisture Content Limit</strong>
                  <p className="text-slate-500 mt-0.5">
                    Moisture content must be below 12% by weight for standard rate acceptance without deduction.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5"></i>
                <div>
                  <strong className="text-slate-900 block font-semibold">Foreign Matter Tolerances</strong>
                  <p className="text-slate-500 mt-0.5">
                    Inorganic matter must not exceed 0.75% and organic impurities should remain below 1.5%.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5"></i>
                <div>
                  <strong className="text-slate-900 block font-semibold">Pest & Infestation Free</strong>
                  <p className="text-slate-500 mt-0.5">
                    Grains must be clean, dry, uniform, and completely free of weevils or storage pests.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5"></i>
                <div>
                  <strong className="text-slate-900 block font-semibold">Standard Packaging</strong>
                  <p className="text-slate-500 mt-0.5">
                    Pack in clean, stitched 50 kg jute or food-grade HDPE gunny bags for electronic weighbridge.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

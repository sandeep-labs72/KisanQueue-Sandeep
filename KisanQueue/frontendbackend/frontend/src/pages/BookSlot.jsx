import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";

export default function BookSlot() {
  const { user, selectedCentre, setSelectedCentre, setCurrentBookingId } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [centre, setCentre] = useState(selectedCentre);
  const [crop, setCrop] = useState("Wheat");
  const [quantity, setQuantity] = useState("50");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState("10:00 - 11:00 AM");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const timeSlots = [
    "09:00 - 10:00 AM",
    "10:00 - 11:00 AM",
    "11:00 - 12:00 PM",
    "12:00 - 01:00 PM",
    "02:00 - 03:00 PM",
    "03:00 - 04:00 PM",
  ];

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const qtyNumber = Number(quantity);
    if (!qtyNumber || qtyNumber <= 0) {
      setErrorMsg("Please enter a valid produce quantity in kg.");
      return;
    }
    if (!date) {
      setErrorMsg("Please select a procurement appointment date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        farmerId: user?.farmerId || "F1001",
        centreId: centre,
        crop,
        quantity: qtyNumber,
        date,
        slot,
      };

      const res = await api.createBooking(payload);

      let token = "A-018";
      let bookingId = `KQ-${Date.now().toString().slice(-8)}`;

      if (res && res.success && res.data) {
        token = res.data.token || token;
        bookingId = res.data.bookingId || bookingId;
      }

      setCurrentBookingId(bookingId);
      setSelectedCentre(centre);

      // Save complete record for offline/instant review
      const bookingRecord = {
        bookingId,
        token,
        farmerName: user?.name || "Farmer",
        centre,
        crop,
        quantity: `${quantity} kg`,
        date,
        time: slot,
        queueAhead: res?.data?.position ? Math.max(0, res.data.position - 1) : 6,
        estimatedWait: res?.data?.position ? `${Math.max(0, res.data.position - 1) * 7} mins` : "42 mins",
      };
      localStorage.setItem("kisanBooking", JSON.stringify(bookingRecord));

      navigate("/booking-confirmation", { state: { booking: bookingRecord } });
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Failed to connect to backend. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Book Procurement Slot / Token
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select your preferred centre, crop, and time slot for direct electronic mandi entry.
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

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-base"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form Card */}
        <form onSubmit={handleConfirmBooking} className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-base font-extrabold text-slate-900">Enter Produce & Slot Details</h3>

          {/* Select Centre */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Procurement Centre
            </label>
            <select
              value={centre}
              onChange={(e) => setCentre(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer"
            >
              <option value="Centre A, Bhagalpur">Centre A, Bhagalpur (Primary Mandi)</option>
              <option value="Centre B, Sabour">Centre B, Sabour (Buffer Warehouse)</option>
              <option value="Centre C, Nathnagar">Centre C, Nathnagar (Cooperative Center)</option>
            </select>
          </div>

          {/* Select Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Crop
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "Wheat", icon: "fa-wheat-awn" },
                { id: "Rice", icon: "fa-seedling" },
                { id: "Maize", icon: "fa-cubes-stacked" },
              ].map((c) => {
                const isSelected = crop === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCrop(c.id)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <i className={`fa-solid ${c.icon}`}></i>
                    <span>{c.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quantity (in kg)
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <i className="fa-solid fa-weight-hanging text-slate-400 text-sm mr-2.5"></i>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full py-3.5 bg-transparent border-none outline-none text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Procurement Date
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                <i className="fa-regular fa-calendar text-slate-400 text-sm mr-2.5"></i>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-3.5 bg-transparent border-none outline-none text-sm font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Available Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {timeSlots.map((s) => {
                const isSelected = slot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`py-3 px-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-98"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Confirming Slot with Backend...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-calendar-check text-base"></i>
                <span>Confirm Slot & Generate Token</span>
              </>
            )}
          </button>
        </form>

        {/* Guidelines Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 h-fit">
          <h3 className="text-base font-extrabold text-slate-900">Booking Guidelines</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Government MSP Guaranteed</strong>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Direct electronic bank settlement credited via PFMS within 24-48 hours of quality approval.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Punctual Arrival</strong>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Please reach 10 minutes prior to designated slot to complete mandi security gate check-in.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <div>
                <strong className="text-slate-900 block font-bold">Documents to Carry</strong>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Carry your original Aadhaar card and verified bank passbook copy for gate clearance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

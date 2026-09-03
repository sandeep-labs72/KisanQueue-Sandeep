import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Payments() {
  const { user, currentBookingId } = useAuth();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(50);
  const [amount, setAmount] = useState(1138);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [transactionId, setTransactionId] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchPaymentData = useCallback(async () => {
    if (!currentBookingId) {
      const saved = localStorage.getItem("kisanBooking");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const q = parseInt(parsed.quantity, 10) || 50;
          setQuantity(q);
          setAmount(Math.round(q * 22.75));
        } catch (e) {}
      }
      return;
    }

    try {
      setLoading(true);
      const bookRes = await api.getBooking(currentBookingId);
      if (bookRes && bookRes.success && bookRes.data) {
        const q = bookRes.data.quantity || 50;
        setQuantity(q);
        setAmount(Math.round(q * 22.75));
      }

      const procRes = await api.getProcurementStatus(currentBookingId);
      if (procRes && procRes.success && procRes.data) {
        setPaymentStatus(procRes.data.paymentStatus || "PENDING");
        if (procRes.data.amount > 0) setAmount(procRes.data.amount);
      }
    } catch (err) {
      console.warn("Payment fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentBookingId]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const handleProcessPayment = async () => {
    if (!currentBookingId) {
      // Offline / demo simulation
      setProcessing(true);
      setPaymentStatus("INITIATED");
      setTimeout(() => {
        setPaymentStatus("CREDITED");
        setTransactionId(`TXN-${Date.now().toString().slice(-8)}`);
        setProcessing(false);
      }, 2000);
      return;
    }

    try {
      setProcessing(true);
      const res = await api.processPayment({
        bookingId: currentBookingId,
        amount,
      });

      if (res && res.success) {
        setPaymentStatus("INITIATED");
        // Backend simulates credit in 2 seconds
        setTimeout(async () => {
          await fetchPaymentData();
          setTransactionId(`TXN-${Date.now().toString().slice(-8)}`);
          setProcessing(false);
        }, 2200);
      } else {
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setProcessing(false);
    }
  };

  const getStatusBadge = () => {
    switch (paymentStatus) {
      case "CREDITED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "INITIATED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-300";
      case "PENDING":
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Direct Benefit Transfer (DBT) Payments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent government MSP payouts credited straight to your linked bank account.
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
        {/* Payment Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Disbursed / Due
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-800 font-mono my-2 tracking-tight">
              ₹{amount.toLocaleString("en-IN")}
            </div>

            <div className="flex items-center gap-2 my-3">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getStatusBadge()}`}>
                {paymentStatus}
              </span>
              <span className="text-xs text-slate-400">PFMS Electronic Gateway</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed my-4">
              {paymentStatus === "CREDITED"
                ? "Funds successfully credited via Direct Benefit Transfer into your State Bank of India account."
                : paymentStatus === "INITIATED"
                ? "Electronic mandate sent to Public Financial Management System (PFMS). Clearing in progress..."
                : "Funds will be credited via PFMS directly to your linked bank account after quality & weighing approval."}
            </p>

            {/* Metrics Block */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl text-center my-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">MSP Rate</span>
                <strong className="text-xs font-black text-slate-800 block mt-0.5">₹22.75 / kg</strong>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Produce Weight</span>
                <strong className="text-xs font-black text-slate-800 block mt-0.5">{quantity} kg</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Reference UTR</span>
                <strong className="text-xs font-mono font-bold text-emerald-700 block mt-0.5 truncate">
                  {transactionId}
                </strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleProcessPayment}
            disabled={processing || paymentStatus === "CREDITED"}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all mt-4 ${
              paymentStatus === "CREDITED"
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-98"
            }`}
          >
            <i className={`fa-solid ${processing ? "fa-spinner fa-spin" : "fa-indian-rupee-sign"}`}></i>
            <span>
              {paymentStatus === "CREDITED"
                ? "Payment Credited Successfully"
                : processing
                ? "Processing DBT Transfer..."
                : "Process / Claim DBT Payment"}
            </span>
          </button>
        </div>

        {/* Registered Bank Account Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-slate-900">Registered DBT Bank Account</h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <i className="fa-solid fa-check text-[10px]"></i>
                <span>NPCI Linked</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Holder:</span>
                <strong className="text-slate-900 font-bold">{user?.name || "Ramesh Kumar"}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Bank Name:</span>
                <strong className="text-slate-800 font-semibold">State Bank of India</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Number:</span>
                <strong className="text-slate-800 font-mono font-semibold">XXXX-XXXX-4819</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">IFSC Code:</span>
                <strong className="text-slate-800 font-mono font-semibold">SBIN0001234</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Branch Location:</span>
                <strong className="text-slate-800 font-semibold">Main Mandi Branch, Bhagalpur</strong>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Direct Benefit Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <i className="fa-solid fa-shield-check text-xs"></i>
                  <span>Aadhaar Authenticated</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 mt-5">
            <i className="fa-solid fa-circle-info text-emerald-600 mr-1.5"></i>
            Settlement is released electronically into this account via PFMS direct transfer within 24 to 48 hours of mandi approval.
          </div>
        </div>
      </div>
    </div>
  );
}

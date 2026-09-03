import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const otpRefs = useRef([]);

  // Auto-format Aadhaar in chunks of 4: "XXXX XXXX XXXX"
  const handleAadhaarChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    const chunks = raw.match(/.{1,4}/g);
    setAadhaar(chunks ? chunks.join(" ") : "");
  };

  // Mobile number 10 digits
  const handleMobileChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(raw);
  };

  // OTP inputs auto-advance
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg("");
    setInfoMsg("OTP sent successfully! Demo OTP: 123456");
    // Pre-fill demo OTP
    setOtp(["1", "2", "3", "4", "5", "6"]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    const cleanAadhaar = aadhaar.replace(/\s/g, "");
    const otpValue = otp.join("");

    if (!name.trim()) {
      setErrorMsg("Please enter farmer name.");
      return;
    }
    if (cleanAadhaar.length !== 12) {
      setErrorMsg("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    if (mobile.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (otpValue !== "123456") {
      setErrorMsg("Invalid OTP. For demo use: 123456");
      return;
    }

    setLoading(true);

    try {
      const res = await api.loginFarmer({
        name: name.trim(),
        mobile,
        aadhaar: cleanAadhaar,
      });

      if (res && res.success && res.data) {
        login({
          farmerId: res.data.farmerId,
          name: res.data.name || name.trim(),
          mobile: res.data.mobile || mobile,
          village: res.data.village,
          district: res.data.district,
        });
      } else {
        // Fallback demo farmer if offline
        login({
          farmerId: "F1001",
          name: name.trim(),
          mobile,
          village: "Bhagalpur",
          district: "Bihar",
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      // Even if network fails, ensure user can test demo
      login({
        farmerId: "F1001",
        name: name.trim(),
        mobile,
        village: "Bhagalpur",
        district: "Bihar",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card-glass">
        {/* BRAND */}
        <div className="flex items-center justify-center gap-2.5 mb-2.5">
          <div className="w-11 h-11 rounded-full bg-emerald-500/90 flex items-center justify-center text-xl text-white shadow-md">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
              Kisan<span className="text-emerald-400">Queue</span>
            </h1>
            <p className="text-[11px] text-white/95 mt-1 tracking-wide">
              {t.smartProcurement || "Smart Procurement System"}
            </p>
          </div>
        </div>

        {/* LOGIN HEADING */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-white/90 mt-0.5">Login to manage your procurement</p>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-500/20 border border-red-400/40 text-red-100 text-xs text-center font-semibold">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-100 text-xs text-center font-semibold">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* FARMER NAME */}
          <div>
            <label className="block text-sm font-bold text-white mb-1">{t.farmer || "Farmer Name"}</label>
            <div className="h-11 flex items-center border border-white/70 rounded-xl bg-white/10 px-3 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <i className="fa-regular fa-user text-white/80 w-8 text-sm"></i>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder-white/80"
              />
            </div>
          </div>

          {/* AADHAAR */}
          <div>
            <label className="block text-sm font-bold text-white mb-1">{t.aadhaar || "Aadhaar Number"}</label>
            <div className="h-11 flex items-center border border-white/70 rounded-xl bg-white/10 px-3 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <i className="fa-solid fa-id-card text-white/80 w-8 text-sm"></i>
              <input
                type="text"
                value={aadhaar}
                onChange={handleAadhaarChange}
                placeholder="Enter 12-digit Aadhaar"
                maxLength={14}
                className="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder-white/80 tracking-wide"
              />
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <label className="block text-sm font-bold text-white mb-1">{t.mobile || "Mobile Number"}</label>
            <div className="h-11 flex items-center border border-white/70 rounded-xl bg-white/10 px-3 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <i className="fa-solid fa-mobile-screen-button text-white/80 w-8 text-sm"></i>
              <input
                type="tel"
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                className="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder-white/80"
              />
            </div>
          </div>

          {/* OTP */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-white">{t.otp || "OTP"}</label>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                {t.sendOtp || "Send OTP"}
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="h-11 text-center font-bold text-lg text-white bg-white/10 border border-white/70 rounded-xl focus:border-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-4 border border-white/80 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>{t.login || "Login"}</span>
              </>
            )}
          </button>
        </form>

        {/* SECURITY */}
        <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-white/95">
          <i className="fa-solid fa-shield-halved text-emerald-400"></i>
          <span>Your information is secure and protected.</span>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-white/20 text-xs">
          <i className="fa-solid fa-globe text-emerald-400"></i>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang} className="text-slate-900 bg-white">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

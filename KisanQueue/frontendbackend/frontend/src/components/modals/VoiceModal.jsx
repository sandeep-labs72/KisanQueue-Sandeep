import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");
  const [statusText, setStatusText] = useState("Listening... Speak your command.");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const speakFeedback = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase();
    setTimeout(() => {
      onClose();
      if (lower.includes("dashboard") || lower.includes("home")) {
        speakFeedback("Opening dashboard.");
        navigate("/dashboard");
      } else if (lower.includes("book") || lower.includes("slot") || lower.includes("token")) {
        speakFeedback("Opening slot booking.");
        navigate("/book-slot");
      } else if (lower.includes("turn") || lower.includes("queue") || lower.includes("number")) {
        speakFeedback("Showing your live queue turn.");
        navigate("/my-turn");
      } else if (lower.includes("produce") || lower.includes("crop") || lower.includes("wheat") || lower.includes("grain")) {
        speakFeedback("Opening your produce details.");
        navigate("/my-produce");
      } else if (lower.includes("status") || lower.includes("procurement") || lower.includes("stage")) {
        speakFeedback("Showing procurement workflow status.");
        navigate("/procurement-status");
      } else if (lower.includes("payment") || lower.includes("rupee") || lower.includes("money") || lower.includes("dbt")) {
        speakFeedback("Opening DBT payments tracker.");
        navigate("/payments");
      } else if (lower.includes("notification") || lower.includes("alert")) {
        speakFeedback("Showing your notifications.");
        navigate("/notifications");
      } else if (lower.includes("help") || lower.includes("support") || lower.includes("call")) {
        speakFeedback("Opening help and support.");
        navigate("/help-support");
      } else {
        speakFeedback(`Command recognized: ${cmd}. Opening dashboard.`);
        navigate("/dashboard");
      }
    }, 800);
  };

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    setTranscript("");
    setStatusText("Listening... Speak your command.");

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(`"${text}"`);
        setStatusText("Processing command...");
        setIsListening(false);
        handleCommand(text);
      };

      recognition.onerror = () => {
        setStatusText("Listening paused. Tap any command below or retry.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {}
    } else {
      setStatusText("Web speech not supported in this browser. Tap commands below:");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Pulsing Mic Circle */}
        <div
          className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${
            isListening
              ? "bg-emerald-600 text-white shadow-emerald-500/40 animate-pulse scale-110"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          <i className="fa-solid fa-microphone"></i>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Voice Assistant</h3>
        <p className="text-sm text-emerald-700 font-medium mb-4">{statusText}</p>

        {transcript && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-slate-800 font-semibold text-sm mb-4">
            {transcript}
          </div>
        )}

        <div className="mt-2 text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">
          Or tap a quick command:
        </div>

        <div className="grid grid-cols-2 gap-2 text-left">
          <button
            onClick={() => handleCommand("Open dashboard")}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-house text-emerald-600"></i>
            <span>"Go to dashboard"</span>
          </button>
          <button
            onClick={() => handleCommand("Show my turn")}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-users text-emerald-600"></i>
            <span>"Show my turn"</span>
          </button>
          <button
            onClick={() => handleCommand("Book a slot")}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
          >
            <i className="fa-regular fa-calendar-plus text-emerald-600"></i>
            <span>"Book a slot"</span>
          </button>
          <button
            onClick={() => handleCommand("Show payments")}
            className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-indian-rupee-sign text-emerald-600"></i>
            <span>"Show payments"</span>
          </button>
        </div>
      </div>
    </div>
  );
}

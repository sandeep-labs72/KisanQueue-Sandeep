import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceAssistantPage() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("Tap the microphone below and speak your command.");
  const recognitionRef = useRef(null);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase();
    setStatusMessage(`Command received: "${cmd}". Processing...`);

    setTimeout(() => {
      if (lower.includes("dashboard") || lower.includes("home")) {
        speak("Opening dashboard.");
        navigate("/dashboard");
      } else if (lower.includes("book") || lower.includes("slot") || lower.includes("token")) {
        speak("Opening slot booking.");
        navigate("/book-slot");
      } else if (lower.includes("turn") || lower.includes("queue")) {
        speak("Showing your live turn.");
        navigate("/my-turn");
      } else if (lower.includes("produce") || lower.includes("crop")) {
        speak("Opening your produce.");
        navigate("/my-produce");
      } else if (lower.includes("status") || lower.includes("procurement")) {
        speak("Showing procurement status.");
        navigate("/procurement-status");
      } else if (lower.includes("payment") || lower.includes("rupee") || lower.includes("dbt")) {
        speak("Opening payments tracker.");
        navigate("/payments");
      } else if (lower.includes("notification") || lower.includes("alert")) {
        speak("Showing notifications.");
        navigate("/notifications");
      } else if (lower.includes("help") || lower.includes("support")) {
        speak("Opening help and support.");
        navigate("/help-support");
      } else {
        speak(`Command recognized. Showing dashboard.`);
        navigate("/dashboard");
      }
    }, 1000);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      setStatusMessage("Listening paused. Tap microphone to speak.");
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setStatusMessage("Speech recognition is not supported in this browser. Please use Google Chrome or tap quick commands below.");
      return;
    }

    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage("Listening... Speak now.");
      setTranscript("");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(`"${text}"`);
      setIsListening(false);
      handleCommand(text);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      setStatusMessage("Could not recognize voice. Tap microphone to try again or choose a command below.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kisan Voice Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hands-free voice navigation for farmers.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Dashboard</span>
        </button>
      </div>

      {/* Main Voice Center Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm text-center">
        {/* Large Animated Mic Button */}
        <button
          onClick={toggleListening}
          className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl transition-all shadow-xl active:scale-95 ${
            isListening
              ? "bg-emerald-600 text-white ring-8 ring-emerald-100 shadow-emerald-500/40 animate-pulse scale-105"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
          }`}
          aria-label="Toggle Microphone"
        >
          <i className="fa-solid fa-microphone"></i>
        </button>

        <h3 className="text-lg font-bold text-slate-900 mt-6 mb-1">
          {isListening ? "Listening to your voice..." : "Tap to Speak"}
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 font-semibold mb-6">{statusMessage}</p>

        {transcript && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-bold text-base my-4 shadow-inner">
            {transcript}
          </div>
        )}

        {/* Suggested Voice Commands */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-3 text-center">
            Or tap to test sample farmer commands:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { cmd: "Open dashboard", desc: "Navigates to main dashboard view" },
              { cmd: "Book a slot", desc: "Opens mandi reservation form" },
              { cmd: "Show my turn", desc: "Displays real-time queue position" },
              { cmd: "Show my produce", desc: "Shows registered crops & valuation" },
              { cmd: "Show procurement status", desc: "Checks 7-stage workflow" },
              { cmd: "Show payments", desc: "Tracks DBT bank payment status" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCommand(item.cmd)}
                className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition-all group"
              >
                <strong className="text-xs font-bold text-slate-900 block group-hover:text-emerald-800">
                  "{item.cmd}"
                </strong>
                <small className="text-[10px] text-slate-400 block">{item.desc}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

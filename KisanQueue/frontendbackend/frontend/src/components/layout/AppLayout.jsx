import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import VoiceModal from "../modals/VoiceModal";
import RouteModal from "../modals/RouteModal";
import CentreModal from "../modals/CentreModal";
import ProfileModal from "../modals/ProfileModal";
import ActionModal from "../modals/ActionModal";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { selectedCentre } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const [centreOpen, setCentreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [actionModalType, setActionModalType] = useState(null);

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-[#18251f]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenVoice={() => setVoiceOpen(true)}
      />

      {/* Main Container */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onToggleMenu={() => setSidebarOpen((prev) => !prev)}
          onOpenVoice={() => setVoiceOpen(true)}
        />

        {/* Centre Selection Strip */}
        <div className="bg-emerald-50/70 border-b border-emerald-200/50 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-emerald-950 font-medium">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-emerald-600 text-sm"></i>
            <span>Active Mandi:</span>
            <strong className="font-bold text-emerald-900">{selectedCentre}</strong>
          </div>
          <button
            onClick={() => setCentreOpen(true)}
            className="px-3 py-1 bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-800 rounded-lg font-bold text-xs transition-colors shadow-xs"
          >
            Change Centre
          </button>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              openVoice: () => setVoiceOpen(true),
              openRoute: () => setRouteOpen(true),
              openCentre: () => setCentreOpen(true),
              openProfile: () => setProfileOpen(true),
              openAction: (type) => setActionModalType(type),
            }}
          />
        </main>
      </div>

      {/* Global Interactive Modals */}
      <VoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <RouteModal isOpen={routeOpen} onClose={() => setRouteOpen(false)} centreName={selectedCentre} />
      <CentreModal isOpen={centreOpen} onClose={() => setCentreOpen(false)} />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <ActionModal
        isOpen={!!actionModalType}
        actionType={actionModalType}
        onClose={() => setActionModalType(null)}
        centreName={selectedCentre}
      />
    </div>
  );
}

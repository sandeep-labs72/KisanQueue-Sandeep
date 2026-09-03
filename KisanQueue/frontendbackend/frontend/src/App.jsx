import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookSlot from "./pages/BookSlot";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyTurn from "./pages/MyTurn";
import MyProduce from "./pages/MyProduce";
import ProcurementStatus from "./pages/ProcurementStatus";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import VoiceAssistantPage from "./pages/VoiceAssistantPage";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard and Sub-Pages */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="book-slot" element={<BookSlot />} />
        <Route path="booking-confirmation" element={<BookingConfirmation />} />
        <Route path="my-turn" element={<MyTurn />} />
        <Route path="my-produce" element={<MyProduce />} />
        <Route path="procurement-status" element={<ProcurementStatus />} />
        <Route path="payments" element={<Payments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="voice-assistant" element={<VoiceAssistantPage />} />
        <Route path="help-support" element={<HelpSupport />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

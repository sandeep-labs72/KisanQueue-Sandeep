import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const isLoggedIn = localStorage.getItem("kisanLoggedIn") === "true";
    if (!isLoggedIn) return null;
    return {
      farmerId: localStorage.getItem("farmerId") || "F1001",
      name: localStorage.getItem("farmerName") || "Farmer",
      mobile: localStorage.getItem("farmerMobile") || "",
      village: localStorage.getItem("farmerVillage") || "Bhagalpur",
      district: localStorage.getItem("farmerDistrict") || "Bihar",
    };
  });

  const [selectedCentre, setSelectedCentreState] = useState(() => {
    return localStorage.getItem("kisanSelectedCentre") || "Centre A, Bhagalpur";
  });

  const [currentBookingId, setCurrentBookingIdState] = useState(() => {
    return localStorage.getItem("kisanCurrentBookingId") || null;
  });

  const [loading, setLoading] = useState(false);

  const setSelectedCentre = (centre) => {
    setSelectedCentreState(centre);
    localStorage.setItem("kisanSelectedCentre", centre);
  };

  const setCurrentBookingId = (bookingId) => {
    setCurrentBookingIdState(bookingId);
    if (bookingId) {
      localStorage.setItem("kisanCurrentBookingId", bookingId);
    } else {
      localStorage.removeItem("kisanCurrentBookingId");
    }
  };

  const login = (farmerData) => {
    const userData = {
      farmerId: farmerData.farmerId || "F1001",
      name: farmerData.name || "Farmer",
      mobile: farmerData.mobile || "",
      village: farmerData.village || "Bhagalpur",
      district: farmerData.district || "Bihar",
    };

    localStorage.setItem("kisanLoggedIn", "true");
    localStorage.setItem("farmerId", userData.farmerId);
    localStorage.setItem("farmerName", userData.name);
    localStorage.setItem("farmerMobile", userData.mobile);
    localStorage.setItem("farmerVillage", userData.village);
    localStorage.setItem("farmerDistrict", userData.district);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("kisanLoggedIn");
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerName");
    localStorage.removeItem("farmerMobile");
    localStorage.removeItem("farmerVillage");
    localStorage.removeItem("farmerDistrict");
    localStorage.removeItem("kisanCurrentBookingId");
    localStorage.removeItem("kisanBooking");
    setUser(null);
    setCurrentBookingIdState(null);
  };

  const refreshFarmerProfile = useCallback(async () => {
    if (!user?.farmerId) return;
    try {
      const res = await api.getFarmerProfile(user.farmerId);
      if (res && res.success && res.data) {
        const updated = {
          farmerId: res.data.farmerId || user.farmerId,
          name: res.data.name || user.name,
          mobile: res.data.mobile || user.mobile,
          village: res.data.village || user.village,
          district: res.data.district || user.district,
        };
        setUser(updated);
        localStorage.setItem("farmerName", updated.name);
        localStorage.setItem("farmerMobile", updated.mobile);
      }
    } catch (err) {
      console.warn("Failed to refresh profile:", err);
    }
  }, [user?.farmerId, user?.name, user?.mobile, user?.village, user?.district]);

  useEffect(() => {
    if (user?.farmerId) {
      refreshFarmerProfile();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        selectedCentre,
        setSelectedCentre,
        currentBookingId,
        setCurrentBookingId,
        refreshFarmerProfile,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

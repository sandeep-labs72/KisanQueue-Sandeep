const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({
      success: false,
      message: `Failed to parse response (Status ${res.status})`,
    }));

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || `Request failed with status ${res.status}`,
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error(`[API Network Error] ${options.method || "GET"} ${url}:`, error);
    return {
      success: false,
      isNetworkError: true,
      message: "Could not connect to backend server. Make sure Backend is running on port 5000.",
      error: error.message,
    };
  }
}

export const api = {
  // Farmer Auth & Profile
  loginFarmer: (data) => request("/farmers/login", { method: "POST", body: data }),
  getFarmerProfile: (farmerId) => request(`/farmers/${farmerId}`),

  // Booking
  createBooking: (data) => request("/bookings", { method: "POST", body: data }),
  getBooking: (bookingId) => request(`/bookings/${bookingId}`),

  // Queue
  getFarmerQueue: (farmerId) => request(`/queue/farmer/${farmerId}`),
  getCentreQueue: (centreId) => request(`/queue/${encodeURIComponent(centreId)}`),
  completeBooking: (bookingId) => request(`/queue/${bookingId}/complete`, { method: "PUT" }),

  // Procurement & Payment
  getProcurementStatus: (bookingId) => request(`/procurement/${bookingId}`),
  updateProcurementStatus: (bookingId, status) =>
    request(`/procurement/${bookingId}/status`, { method: "PUT", body: { status } }),
  processPayment: (data) => request("/procurement/payment", { method: "POST", body: data }),
};

export default api;

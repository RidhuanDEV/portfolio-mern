// useDataStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // http://localhost:5000/api/auth
axios.defaults.withCredentials = true;

// Ensure each state-changing request includes the XSRF token header (double-submit)
const getCsrfFromCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

axios.interceptors.request.use((config) => {
  const token = getCsrfFromCookie();
  if (token) {
    config.headers = config.headers || {};
    // common header name used by our backend middleware
    config.headers["x-xsrf-token"] = token;
  }
  return config;
});

export const useDataStore = create((set) => ({
  isLoading: false,
  home: null,
  error: false, // <-- selalu boolean
  message: "",
  homeData: async () => {
    set({ isLoading: true, error: false, message: "" });
    try {
      const res = await axios.get(`${API_URL}/home`);
      // kalau 2xx tapi success=false (jarang, tapi amankan)
      if (res.data?.success === false) {
        return set({
          isLoading: false,
          home: null,
          error: true, // bukan error, data kosong saja
          message: res.data?.message || "No data found",
        });
      }
      // success
      set({
        home: res.data?.data ?? null,
        error: false,
        message: res.data?.message || "OK",
      });
    } catch (err) {
      // Jika 404, treat sebagai no data, bukan error
      if (err.response?.status === 404) {
        set({
          home: null,
          error: false, // debug
          message: err.response.data?.message || "No home data found",
        });
      } else {
        // Error lain (500, network, dll)
        set({
          home: null,
          error: true,
          message:
            err?.response?.data?.message ||
            err.message ||
            "Failed to fetch data",
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

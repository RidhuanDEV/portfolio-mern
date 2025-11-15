import { create } from "zustand";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      // Store token in localStorage for persistence
      localStorage.setItem("auth_token", "true"); // Simple flag that token exists
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Error logging in";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          timeout: 5000,
        }
      );
      // Clear token from localStorage
      localStorage.removeItem("auth_token");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      // Even if logout fails, clear local state and storage
      localStorage.removeItem("auth_token");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      console.error("Logout error:", error.message);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // Check if we have a stored token indicator
      const hasToken = localStorage.getItem("auth_token");
      if (!hasToken) {
        set({ isCheckingAuth: false });
        return;
      }

      // Verify the token with the backend
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        isAuthenticated: true,
        user: response.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      // Token is invalid or expired, clear storage
      localStorage.removeItem("auth_token");
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      console.error("Auth check failed:", error.message);
    }
  },
}));

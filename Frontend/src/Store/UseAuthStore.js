import { axiosInstance } from "../lib/axios"
import { toast } from "react-hot-toast"
import { create } from "zustand"

export const useAuth = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.post("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            await axiosInstance.post("/auth/register", data);
            toast.success("Account created successfully! Please log in.");
            return true; 
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Error signing up");
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    signIn: async (data) => {
        set({ isSigningIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            const token = res.data.token || res.data;
            localStorage.setItem("jwt", token);
            await get().checkAuth(); 
            
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            set({ isSigningIn: false });
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem("jwt");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
        }
    }
}));
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Store/UseAuthStore";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import DashboardPage from "./Pages/DasboardPage";

/* ── protected route wrapper ── */
const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuth();
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};

/* ── loading spinner ── */
const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-[#333333] animate-spin" />
      <p className="text-sm text-[#706C61] tracking-wide">Loading…</p>
    </div>
  </div>
);

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <FullScreenLoader />;

  return (
    <>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            {/* ── auth routes ── */}
            <Route
              path="/signup"
              element={
                authUser ? <Navigate to="/dashboard" replace /> : <SignUp />
              }
            />
            <Route
              path="/login"
              element={
                authUser ? <Navigate to="/dashboard" replace /> : <Login />
              }
            />

            {/* ── protected ── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* ── fallback ── */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333333",
            color: "#FFFFFF",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;
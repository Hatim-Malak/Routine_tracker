import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Store/UseAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[#E1F4F3] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Left: User avatar + greeting ── */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E1F4F3] flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-[#333333]" />
            </div>
            <span className="font-bold text-xl text-[#333333]">
              Hi, {authUser?.username || "User"} 
            </span>
          </div>

          {/* ── Desktop: center link ── */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                isActive("/dashboard") ? "bg-[#E1F4F3] text-[#333333]" : "text-[#706C61] hover:text-[#333333] hover:bg-[#E1F4F3]/50"
              }`}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* ── Desktop: Logout ── */}
          <div className="hidden md:flex items-center">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#706C61] hover:text-[#333333] hover:bg-red-50 transition-all duration-200 cursor-pointer bg-transparent border-none">
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-[#333333] hover:bg-[#E1F4F3] transition-colors bg-transparent border-none cursor-pointer">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-[#E1F4F3] bg-white/90 backdrop-blur-xl">
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                  isActive("/dashboard") ? "bg-[#E1F4F3] text-[#333333]" : "text-[#706C61] hover:text-[#333333] hover:bg-[#E1F4F3]/50"
                }`}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <hr className="border-[#E1F4F3] my-1" />
              <button onClick={() => { setMobileOpen(false); logout(); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#706C61] hover:text-[#333333] hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Store/UseAuthStore";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

/* ────────────────────────────────────────────────
   Premium Animated Panel — Dynamic Node Network
   Full-height floating glass morphism + blurred orbs
   ──────────────────────────────────────────────── */
const PremiumPanel = () => (
  <div className="relative w-full h-screen overflow-hidden bg-[#E1F4F3]">
    {/* ── Slow-drifting blurred orbs ── */}
    <motion.div
      animate={{ x: [0, 80, -50, 20, 0], y: [0, -60, 40, -20, 0] }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[5%] left-[10%] w-80 h-80 rounded-full bg-[#333333]/[0.04] blur-[80px]"
    />
    <motion.div
      animate={{ x: [0, -70, 60, -30, 0], y: [0, 50, -60, 30, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[5%] right-[5%] w-96 h-96 rounded-full bg-[#333333]/[0.06] blur-[100px]"
    />
    <motion.div
      animate={{ x: [0, 40, -60, 0], y: [0, -80, 30, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[40%] left-[40%] w-64 h-64 rounded-full bg-[#706C61]/[0.05] blur-[70px]"
    />
    <motion.div
      animate={{ x: [0, -40, 50, 0], y: [0, 30, -50, 0] }}
      transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[15%] right-[25%] w-52 h-52 rounded-full bg-[#333333]/[0.03] blur-[60px]"
    />

    {/* ── Rotating wireframe shapes ── */}
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="absolute top-[6%] right-[12%] w-40 h-40 border border-[#706C61]/[0.12] rounded-2xl" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[8%] left-[8%] w-56 h-56 border border-[#706C61]/[0.09] rounded-full" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="absolute top-[50%] right-[5%] w-24 h-24 border border-[#333333]/[0.08] rounded-xl" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[35%] left-[30%] w-32 h-32 border border-[#706C61]/[0.07] rounded-full" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] left-[50%] w-20 h-20 border border-[#333333]/[0.06] rounded-lg" />

    {/* ── Floating glassmorphism cards ── */}
    <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[12%] left-[8%] bg-white/[0.45] backdrop-blur-xl rounded-2xl shadow-lg border border-white/[0.35] px-5 py-4 z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#333333]/[0.08] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#333333]/[0.25]" />
        </div>
        <div>
          <div className="w-20 h-2 rounded bg-[#333333]/[0.15] mb-1.5" />
          <div className="w-14 h-1.5 rounded bg-[#706C61]/[0.1]" />
        </div>
      </div>
      <div className="w-full h-2. rounded-full bg-[#706C61]/[0.08] overflow-hidden">
        <motion.div animate={{ width: ["40%", "85%", "40%"] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="h-full rounded-full bg-[#333333]/[0.2]" />
      </div>
    </motion.div>

    <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 7, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[35%] right-[8%] bg-white/[0.45] backdrop-blur-xl rounded-2xl shadow-lg border border-white/[0.35] px-5 py-4 z-10">
      <div className="flex gap-1.5 mb-3">
        {[true, false, true, true, false, true, true].map((f, i) => (
          <div key={i} className={`w-4 h-4 rounded-sm ${f ? "bg-[#333333]/[0.2]" : "bg-[#E1F4F3] border border-[#706C61]/[0.08]"}`} />
        ))}
      </div>
      <div className="w-24 h-1.5 rounded bg-[#706C61]/[0.1]" />
    </motion.div>

    <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[18%] left-[15%] bg-white/[0.45] backdrop-blur-xl rounded-2xl shadow-lg border border-white/[0.35] px-5 py-4 z-10">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-[#333333]/[0.1]" />
        <div className="w-16 h-2 rounded bg-[#333333]/[0.15]" />
      </div>
      <div className="flex items-end gap-1 h-8">
        {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
          <div key={i} className="w-2.5 rounded-t-sm bg-[#333333]/[0.15]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </motion.div>

    <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 8, delay: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[38%] right-[18%] bg-white/[0.45] backdrop-blur-xl rounded-2xl shadow-lg border border-white/[0.35] px-4 py-3 z-10">
      <div className="w-10 h-10 rounded-full border-3 border-[#333333]/[0.12] border-t-[#333333]/[0.3] mx-auto mb-2" />
      <div className="w-14 h-1.5 rounded bg-[#706C61]/[0.1] mx-auto" />
    </motion.div>

    {/* ── Subtle floating particles ── */}
    {[
      { top: "70%", left: "55%", size: "w-3 h-3", dur: 12, delay: 0 },
      { top: "25%", left: "65%", size: "w-2 h-2", dur: 15, delay: 2 },
      { top: "80%", left: "30%", size: "w-4 h-4", dur: 10, delay: 1 },
      { top: "15%", left: "35%", size: "w-2.5 h-2.5", dur: 13, delay: 3 },
      { top: "55%", left: "75%", size: "w-3 h-3", dur: 11, delay: 4 },
    ].map((p, i) => (
      <motion.div key={i}
        animate={{ y: [0, -25, 0], x: [0, 15, -10, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute ${p.size} rounded-full bg-[#706C61]/[0.08]`}
        style={{ top: p.top, left: p.left }}
      />
    ))}

    {/* ── Center headline ── */}
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 pointer-events-none">
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
        className="text-2xl lg:text-3xl font-bold text-[#333333] text-center leading-snug">
        Build habits that stick.
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
        className="text-sm text-[#706C61] mt-2 text-center">
        Track, measure, and grow — one routine at a time.
      </motion.p>
    </div>
  </div>
);

/* ── Input ── */
const InputField = ({ icon: Icon, type, placeholder, value, onChange, name, endAdornment }) => (
  <div className="relative group">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706C61] group-focus-within:text-[#333333] transition-colors">
      <Icon className="w-[18px] h-[18px]" />
    </div>
    <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required
      className="w-full pl-11 pr-11 py-3 rounded-xl border border-[#706C61] bg-white text-[#333333] text-sm placeholder:text-[#706C61]/60 outline-none transition-all duration-200 focus:border-[#333333] focus:ring-2 focus:ring-[#E1F4F3]" />
    {endAdornment && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{endAdornment}</div>}
  </div>
);

/* ── Signup Page ── */
const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, isSigningUp } = useAuth();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signUp({ username: formData.username, email: formData.email, password: formData.password });
    if (success) navigate("/login", { state: { fromSignup: true } });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFFFFF]">
      {/* LEFT: animated panel */}
      <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:block md:w-1/2 h-screen">
        <PremiumPanel />
      </motion.div>

      {/* RIGHT: form */}
      <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full md:w-1/2 min-h-screen flex items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <h1 className="text-3xl font-bold text-[#333333] mb-1">Create Account</h1>
            <p className="text-[#706C61] text-sm mb-8">Start building better routines today.</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col gap-4">
            <InputField icon={User} type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
            <InputField icon={Mail} type="email" placeholder="Email address" name="email" value={formData.email} onChange={handleChange} />
            <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="Password" name="password" value={formData.password} onChange={handleChange}
              endAdornment={
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[#706C61] hover:text-[#333333] transition-colors cursor-pointer" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              } />

            <motion.button type="submit" disabled={isSigningUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#333333] text-white font-medium text-sm cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSigningUp ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account…
                </span>
              ) : (<>Sign Up <ArrowRight className="w-4 h-4" /></>)}
            </motion.button>
          </motion.form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 text-center text-sm text-[#706C61]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#333333] font-semibold hover:underline underline-offset-2">Log in</Link>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;
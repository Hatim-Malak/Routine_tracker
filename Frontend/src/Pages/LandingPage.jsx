import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../Store/UseAuthStore";
import { Loader2, ArrowRight, Clock, CalendarDays, PieChart, Target } from "lucide-react";

/* ── Floating Mockup Component ── */
const GraphMockup = () => {
  const days = Array.from({ length: 35 });
  
  return (
    <div className="relative w-full max-w-sm mx-auto md:ml-auto md:mr-0 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-[#E1F4F3] shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#E1F4F3] flex items-center justify-center">
          <Target className="w-5 h-5 text-[#333333]" />
        </div>
        <div>
          <div className="w-24 h-3.5 rounded bg-[#333333]/10 mb-2"></div>
          <div className="w-16 h-2.5 rounded bg-[#706C61]/10"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((_, i) => {
          // Pre-determine dummy active squares to simulate typical use
          const isActive = [3, 4, 8, 10, 11, 14, 15, 17, 18, 22, 23, 24, 25, 29, 31, 32].includes(i);
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.2, type: "spring", stiffness: 200 }}
              className={`w-full aspect-square rounded-sm ${isActive ? 'bg-[#333333]' : 'bg-[#E1F4F3] border border-[#706C61]/5'}`}
            />
          );
        })}
      </div>
      
      {/* Little floating element simulating analytics/streak callout */}
      <motion.div 
        animate={{ y: [-6, 6, -6] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 -bottom-4 bg-[#FFFFFF] rounded-lg p-3 border border-[#E1F4F3] shadow-lg flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-[#333333]"></div>
        <span className="text-xs font-semibold text-[#333333]">Active Streak</span>
      </motion.div>
    </div>
  );
};

/* ── Main Landing Page ── */
const LandingPage = () => {
  const { authUser, isCheckingAuth } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans selection:bg-[#E1F4F3] selection:text-[#333333]">
      {/* Shared Navbar Strip across landing routes */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#E1F4F3]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-[#333333]" />
            <span className="font-bold text-lg text-[#333333]">RoutineX</span>
          </div>
          <div>
            {!isCheckingAuth && !authUser && (
              <Link to="/login" className="text-sm font-medium text-[#706C61] hover:text-[#333333] transition-colors">
                Log in
              </Link>
            )}
            {!isCheckingAuth && authUser && (
              <Link to="/dashboard" className="text-sm font-medium text-[#706C61] hover:text-[#333333] transition-colors">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E1F4F3] rounded-full blur-[100px] opacity-60 -z-10 animate-pulse"></div>
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#E1F4F3] rounded-full blur-[90px] opacity-40 -z-10"></div>

        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center overflow-visible">
          {/* Left Text Block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E1F4F3] bg-[#F7FCFB] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#706C61] mb-6">
              Built for focus and clarity
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#333333] leading-[1.05] mb-6">
              Master your routine. <br />
              <span className="text-[#333333]/90">Reclaim every hour.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#706C61] mb-8 max-w-2xl leading-relaxed">
              RoutineX turns your daily plan into a visible workflow, so your time blocks stay organized, measurable, and easy to follow.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {isCheckingAuth ? (
                <button disabled className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#333333] text-white rounded-xl font-medium opacity-70 cursor-not-allowed transition-all">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </button>
              ) : authUser ? (
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#333333] text-white rounded-xl font-medium hover:scale-[1.03] hover:shadow-lg transition-transform duration-200">
                  Go to Dashboard <ArrowRight className="w-5 h-5 text-[#E1F4F3]" />
                </Link>
              ) : (
                <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#333333] text-white rounded-xl font-medium hover:scale-[1.03] hover:shadow-lg transition-transform duration-200">
                  Start Tracking for Free <ArrowRight className="w-5 h-5 text-[#E1F4F3]" />
                </Link>
              )}
              <a href="#workflow" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#E1F4F3] bg-white text-[#333333] font-medium hover:bg-[#F7FCFB] transition-all duration-200">
                How it works
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 w-full">
              <div className="rounded-[24px] border border-[#E1F4F3] bg-white p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-[#706C61] mb-3">Visual planning</p>
                <p className="text-sm text-[#475158] leading-6">
                  See your day as blocks, not a list. One glance tells you what matters next.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#E1F4F3] bg-white p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-[#706C61] mb-3">Consistent streaks</p>
                <p className="text-sm text-[#475158] leading-6">
                  Build momentum with activity history that rewards every completed task.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full relative z-10"
          >
            <GraphMockup />
          </motion.div>
        </div>
      </section>

      {/* Features Bento Box */}
      <section className="py-24 bg-[#FAFAFA] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Why RoutineX?</h2>
            <p className="text-[#706C61] text-lg">Built for focus, designed for clarity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="bg-[#FFFFFF] border border-[#E1F4F3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E1F4F3] flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#333333]" />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">Time-Blocked Tasks</h3>
              <p className="text-[#706C61] leading-relaxed">
                Schedule your day with precision. Only mark tasks complete within their active time window to stay fully invested in the present.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#FFFFFF] border border-[#E1F4F3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E1F4F3] flex items-center justify-center mb-6">
                <CalendarDays className="w-6 h-6 text-[#333333]" />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">GitHub-Style Consistency</h3>
              <p className="text-[#706C61] leading-relaxed">
                Gamify your habits. Build streaks and view your 30-day performance in a beautiful, grid-based history chart that rewards showing up.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#FFFFFF] border border-[#E1F4F3] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E1F4F3] flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6 text-[#333333]" />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">Deep Analytics</h3>
              <p className="text-[#706C61] leading-relaxed">
                Gain actionable insights. Break down your routine performance with beautiful dynamic charts to see exactly where your time goes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="workflow" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid gap-16 lg:grid-cols-[0.95fr_0.95fr] items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#E1F4F3] bg-[#F7FCFB] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#706C61] mb-6">
              RoutineX process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-6">Built around your day, not your dashboard.</h2>
            <p className="text-[#706C61] max-w-xl leading-8 mb-8">
              RoutineX helps you create, refine and sustain routines with minimal effort. The workflow is simple, powerful, and designed for long-term focus.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#E1F4F3] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706C61] mb-3">Step 1</p>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Plan your day</h3>
                <p className="text-[#475158] leading-7">Add tasks, set times, and define your daily focus in a clean schedule card.</p>
              </div>
              <div className="rounded-[24px] border border-[#E1F4F3] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706C61] mb-3">Step 2</p>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Track your progress</h3>
                <p className="text-[#475158] leading-7">Mark tasks complete and keep your history visible for consistent momentum.</p>
              </div>
              <div className="rounded-[24px] border border-[#E1F4F3] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706C61] mb-3">Step 3</p>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Refine the next day</h3>
                <p className="text-[#475158] leading-7">Use fast insights to adjust your routine and focus on the activities that move you forward.</p>
              </div>
              <div className="rounded-[24px] border border-[#E1F4F3] bg-[#F7FCFB] p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs uppercase tracking-[0.32em] text-[#706C61] mb-3">Designed for</p>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Professionals & creators</h3>
                <p className="text-[#475158] leading-7">A polished routine experience that fits ambitious schedules without friction.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[28px] border border-[#E1F4F3] bg-[#FFFFFF] p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#706C61]">Daily snapshot</p>
                  <h3 className="text-2xl font-semibold text-[#333333] mt-3">Routine at a glance</h3>
                </div>
                <span className="inline-flex rounded-full bg-[#E1F4F3] px-3 py-1 text-xs font-semibold text-[#333333]">4 slots</span>
              </div>
              <p className="text-[#706C61] leading-7 mb-6">Keep a fixed history chart below and build your top performance widgets above for a dashboard that always feels intentional.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#F7FCFB] p-4 border border-[#E1F4F3]">
                  <p className="text-sm font-semibold text-[#333333]">Flexible widget grid</p>
                  <p className="text-sm text-[#706C61] leading-6">Pick the four cards that matter most to your workflow.</p>
                </div>
                <div className="rounded-3xl bg-[#F7FCFB] p-4 border border-[#E1F4F3]">
                  <p className="text-sm font-semibold text-[#333333]">Fixed history graph</p>
                  <p className="text-sm text-[#706C61] leading-6">Your activity timeline always stays visible at the bottom.</p>
                </div>
              </div>
            </div>
            <GraphMockup />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#E1F4F3] py-16 px-6">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#706C61]" />
              <span className="text-xl font-bold text-[#333333]">RoutineX</span>
            </div>
            <p className="text-sm text-[#706C61] max-w-sm leading-7">
              A modern routine planner built for clarity, consistent performance, and effortless daily focus.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#706C61] mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-[#475158]">
              <li><Link to="/dashboard" className="hover:text-[#333333] transition-colors">Dashboard</Link></li>
              <li><Link to="/signup" className="hover:text-[#333333] transition-colors">Sign up</Link></li>
              <li><a href="#workflow" className="hover:text-[#333333] transition-colors">How it works</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#706C61] mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-[#475158]">
              <li><a href="#" className="hover:text-[#333333] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#333333] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#333333] transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#706C61] mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-[#475158]">
              <li><a href="#" className="hover:text-[#333333] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#333333] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#333333] transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#E1F4F3] pt-6 text-sm text-[#706C61] sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} RoutineX. All rights reserved.</p>
          <p className="text-[#475158]">Designed for productive routines and fluent daily rhythm.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import Navbar from "../Components/Navbar";
import DraggableDashboard from "../Components/DraggableDashboard";
import HistoryGraph from "../Components/HistoryGraph";
import Seo from "../Components/Seo";
import { CalendarDays, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const getHistoryForGraph = useTask((s) => s.getHistoryForGraph);
  const getStatsForGraph = useTask((s) => s.getStatsForGraph);
  const getDashboardLayout = useTask((s) => s.getDashboardLayout);
  const history = useTask((s) => s.history);
  const navigate = useNavigate();
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await getDashboardLayout();
        await getHistoryForGraph();
        await getStatsForGraph();
      } catch (e) {
        // ignore — user will see dashboard fallback
      }
    };

    init();
  }, [getHistoryForGraph, getStatsForGraph, getDashboardLayout]);

  // react to live history changes (e.g., deletions) so the prompt shows immediately
  useEffect(() => {
    setShowCreatePrompt(!history || history.length === 0);
  }, [history]);

  return (
    <div className="min-h-screen relative bg-[#FAFAFA] overflow-hidden">
      <Seo
        title="Dashboard — RoutineX"
        description="Your dashboard: four configurable widgets and a 30-day history heatmap to track progress and streaks."
        url="https://example.com/dashboard"
        canonical="https://example.com/dashboard"
      />
      {/* ── Fixed Geometric Canvas Background ── */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#E1F4F3 2px, transparent 2px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1920px' }}>
          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-[#333333] to-[#706C61]">
              Dashboard
            </h1>
            <p className="text-sm font-medium text-[#706C61] mt-2">
              Here's an overview of your routines and progress.
            </p>
          </motion.div>

          {/* ── Prompt: Create routine when none exists ── */}
          {showCreatePrompt && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 px-4 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl p-4 flex items-center justify-between gap-4 bg-linear-to-r from-[#FFF7E6] to-[#FFFFFF] border border-[#F5E0B7] shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-[#FFF3D6] to-[#FFE9B8] shadow-inner">
                    <Sparkles className="w-6 h-6 text-[#C47A00]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#3b2d00]">You're almost ready — create your first routine</p>
                    <p className="text-sm text-[#6b582a] mt-1">Add tasks now to start building streaks and visual reports.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/create-routine')}
                    className="bg-[#333333] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-95 shadow-md"
                  >
                    Create Routine
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Master flex column ── */}
          <div className="flex flex-col gap-8">
            {/* ── Draggable 4-Slot Dashboard ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-[#E1F4F3] shadow-xl shadow-[#E1F4F3]/50 rounded-3xl overflow-hidden"
            >
              <DraggableDashboard />
            </motion.div>

            {/* ── Bottom Row: History (full width, fixed) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl border border-[#E1F4F3] shadow-xl shadow-[#E1F4F3]/50 rounded-3xl p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-[#E1F4F3] flex items-center justify-center shadow-sm">
                  <CalendarDays className="w-5 h-5 text-[#333333]" />
                </div>
                <h2 className="text-base font-bold text-[#333333] tracking-tight">30-Day History</h2>
              </div>
              <HistoryGraph />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
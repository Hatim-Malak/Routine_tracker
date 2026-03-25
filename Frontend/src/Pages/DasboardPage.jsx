import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import Navbar from "../Components/Navbar";
import HistoryGraph from "../Components/HistoryGraph";
import { ConsistencyChart, BreakdownChart } from "../Components/StatGraph";
import { CalendarDays, BarChart3, PieChart } from "lucide-react";

const DashboardPage = () => {
  const { getHistoryForGraph, getStatsForGraph } = useTask();

  useEffect(() => {
    getHistoryForGraph();
    getStatsForGraph();
  }, [getHistoryForGraph, getStatsForGraph]);

  return (
    <div className="min-h-screen relative bg-[#FAFAFA] overflow-hidden">
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

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#333333] to-[#706C61]">
              Dashboard
            </h1>
            <p className="text-sm font-medium text-[#706C61] mt-2">
              Here's an overview of your routines and progress.
            </p>
          </motion.div>

          {/* ── Master flex column ── */}
          <div className="flex flex-col gap-8">
            {/* ── Top Row: Analytics (60 / 40 split) ── */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Analytics chart — 60% */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:w-[60%] bg-white/80 backdrop-blur-xl border border-[#E1F4F3] shadow-xl shadow-[#E1F4F3]/50 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-[#E1F4F3] flex items-center justify-center shadow-sm">
                    <BarChart3 className="w-5 h-5 text-[#333333]" />
                  </div>
                  <h2 className="text-base font-bold text-[#333333] tracking-tight">Analytics</h2>
                </div>
                <ConsistencyChart />
              </motion.div>

              {/* Pie chart — 40% */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="lg:w-[40%] bg-white/80 backdrop-blur-xl border border-[#E1F4F3] shadow-xl shadow-[#E1F4F3]/50 rounded-3xl p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-[#E1F4F3] flex items-center justify-center shadow-sm">
                    <PieChart className="w-5 h-5 text-[#333333]" />
                  </div>
                  <h2 className="text-base font-bold text-[#333333] tracking-tight">Breakdown</h2>
                </div>
                <BreakdownChart />
              </motion.div>
            </div>

            {/* ── Bottom Row: History (full width) ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-[#E1F4F3] shadow-xl shadow-[#E1F4F3]/50 rounded-3xl p-6 lg:p-8 mb-12"
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
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
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-[#333333]">Dashboard</h1>
          <p className="text-sm text-[#706C61] mt-1">
            Here's an overview of your routines and progress.
          </p>
        </motion.div>

        {/* ── Master flex column ── */}
        <div className="flex flex-col gap-8">
          {/* ── Top Row: Analytics (60 / 40 split) ── */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Bar / Line chart — 60% */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:w-[60%] bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E1F4F3] p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#E1F4F3] flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-[#333333]" />
                </div>
                <h2 className="text-sm font-semibold text-[#333333]">Analytics</h2>
              </div>
              <ConsistencyChart />
            </motion.div>

            {/* Pie chart — 40% */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:w-[40%] bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E1F4F3] p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#E1F4F3] flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-[#333333]" />
                </div>
                <h2 className="text-sm font-semibold text-[#333333]">Breakdown</h2>
              </div>
              <BreakdownChart />
            </motion.div>
          </div>

          {/* ── Bottom Row: History (full width) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E1F4F3] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#E1F4F3] flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-[#333333]" />
              </div>
              <h2 className="text-sm font-semibold text-[#333333]">30-Day History</h2>
            </div>
            <HistoryGraph />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
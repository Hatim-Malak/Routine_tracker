import React from "react";
import { ConsistencyChart, BreakdownChart } from "./StatGraph";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const DashboardWidget = ({ type }) => {
  const renderWidget = () => {
    switch (type) {
      case "CONSISTENCY":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <ConsistencyChart />
          </motion.div>
        );
      case "BREAKDOWN":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <BreakdownChart />
          </motion.div>
        );
      case "HISTORY":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#A6A399] bg-[#F7FCFB]"
          >
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-[#333333]">History is always at the bottom</p>
              <p className="text-xs text-[#706C61] mt-2">Drag a different widget here from the top menu.</p>
            </div>
          </motion.div>
        );
      case "EMPTY":
      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#E1F4F3]/30 to-[#E1F4F3]/10 border-2 border-dashed border-[#A6A399] rounded-2xl"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#E1F4F3]/50 flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-[#706C61]" />
              </div>
              <p className="text-[#333333] font-semibold text-sm">No widget selected</p>
              <p className="text-[#706C61] text-xs mt-1">Add a widget to customize your dashboard</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E1F4F3] overflow-hidden h-full">
      <div className="p-4 h-full">
        {renderWidget()}
      </div>
    </div>
  );
};

export default DashboardWidget;

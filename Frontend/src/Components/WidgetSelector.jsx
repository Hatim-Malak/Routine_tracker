import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, PieChart, X } from "lucide-react";

const WidgetSelector = ({ onSelect, onClose }) => {
  const widgets = [
    {
      id: "CONSISTENCY",
      name: "Consistency Chart",
      description: "Daily completion trends",
      icon: BarChart3,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: "BREAKDOWN",
      name: "Breakdown Chart",
      description: "Routine popularity",
      icon: PieChart,
      color: "from-purple-400 to-purple-600"
    },
    // HISTORY is not selectable in the top widget slots; it remains fixed in the dashboard bottom.
    // {
    //   id: "HISTORY",
    //   name: "History Calendar",
    //   description: "30-day completion grid",
    //   icon: CalendarDays,
    //   color: "from-teal-400 to-teal-600"
    // }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-[#E1F4F3] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E1F4F3]">
            <h3 className="text-lg font-bold text-[#333333]">Select Widget</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#E1F4F3]/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#706C61]" />
            </button>
          </div>

          {/* Widget Options */}
          <div className="p-4 space-y-3">
            {widgets.map((widget) => {
              const Icon = widget.icon;
              return (
                <motion.button
                  key={widget.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(widget.id)}
                  className="w-full p-4 rounded-xl bg-linear-to-r from-[#E1F4F3]/30 to-[#E1F4F3]/10 hover:from-[#E1F4F3]/50 hover:to-[#E1F4F3]/20 border border-[#E1F4F3] transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-linear-to-br ${widget.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#333333] text-sm group-hover:text-black transition-colors">
                        {widget.name}
                      </p>
                      <p className="text-[#706C61] text-xs mt-0.5">{widget.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WidgetSelector;

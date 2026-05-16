import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  PieChart, 
  X, 
  CalendarDays, 
  Target, 
  Clock, 
  Trophy,
  Activity
} from "lucide-react";

const WidgetSelector = ({ onSelect, onClose }) => {
  const widgets = [
    {
      id: "CONSISTENCY",
      name: "Consistency",
      description: "Daily completion trends",
      icon: Activity,
    },
    {
      id: "BREAKDOWN",
      name: "Task Breakdown",
      description: "Routine popularity pie",
      icon: PieChart,
    },
    {
      id: "WEEKLY_ACTIVITY",
      name: "Weekly Activity",
      description: "Day-by-day bar chart",
      icon: CalendarDays,
    },
    {
      id: "ROUTINE_BALANCE",
      name: "Category Balance",
      description: "Radar chart distribution",
      icon: Target,
    },
    {
      id: "TIME_OF_DAY",
      name: "Peak Focus",
      description: "Time of day line chart",
      icon: Clock,
    },
    {
      id: "GOAL_PROGRESS",
      name: "Goal Progress",
      description: "Weekly target gauge",
      icon: Trophy,
    }
  ];

  // Animation variants for a staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#E1F4F3] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E1F4F3]/60 bg-white/50">
            <div>
              <h3 className="text-xl font-extrabold text-[#323643] tracking-tight">Widget Library</h3>
              <p className="text-xs text-[#706C61] mt-1 font-medium">Select a module to customize your dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-[#F7FCFB] hover:bg-[#E1F4F3] rounded-full transition-colors group"
            >
              <X className="w-5 h-5 text-[#706C61] group-hover:text-[#323643]" />
            </button>
          </div>

          {/* Widget Options Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
          >
            {widgets.map((widget) => {
              const Icon = widget.icon;
              return (
                <motion.button
                  variants={itemVariants}
                  key={widget.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(widget.id)}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-[#E1F4F3]/60 hover:border-[#323643]/30 hover:shadow-md transition-all text-left group flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-[#323643] to-[#4a5063] shadow-inner group-hover:shadow-[#323643]/20 transition-all">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-bold text-[#323643] text-sm mb-0.5">
                      {widget.name}
                    </p>
                    <p className="text-[#706C61] text-xs font-medium leading-relaxed">
                      {widget.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WidgetSelector;
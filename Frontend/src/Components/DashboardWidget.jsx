import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import ChartErrorBoundary from "./ChartErrorBoundary";

const ConsistencyChart = lazy(() => import("./StatGraph").then((module) => ({ default: module.ConsistencyChart })));
const BreakdownChart = lazy(() => import("./StatGraph").then((module) => ({ default: module.BreakdownChart })));
const WeeklyActivityChart = lazy(() => import("./StatGraph").then((module) => ({ default: module.WeeklyActivityChart })));
const RoutineBalanceChart = lazy(() => import("./StatGraph").then((module) => ({ default: module.RoutineBalanceChart })));
const TimeOfDayChart = lazy(() => import("./StatGraph").then((module) => ({ default: module.TimeOfDayChart })));
const GoalProgressChart = lazy(() => import("./StatGraph").then((module) => ({ default: module.GoalProgressChart })));

const WidgetLoadingSkeleton = ({ title }) => (
  <div className="w-full h-full min-w-0 min-h-0 rounded-3xl border border-[#E1F4F3] bg-[#FAFAFA] p-6 animate-pulse">
    <div className="h-4 w-36 rounded-full bg-[#E1F4F3] mb-5" />
    <div className="h-[calc(100%-3.5rem)] rounded-[1.5rem] bg-[#E1F4F3]/80" />
  </div>
);

const WidgetSuspenseWrapper = ({ title, children }) => (
  <Suspense fallback={<WidgetLoadingSkeleton title={title} />}>
    <ChartErrorBoundary>{children}</ChartErrorBoundary>
  </Suspense>
);

const DashboardWidget = ({ type }) => {
  const renderWidget = () => {
    switch (type) {
      case "CONSISTENCY":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0"
          >
            <WidgetSuspenseWrapper title="Consistency">
              <ConsistencyChart />
            </WidgetSuspenseWrapper>
          </motion.div>
        );
      case "BREAKDOWN":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0"
          >
            <WidgetSuspenseWrapper title="Breakdown">
              <BreakdownChart />
            </WidgetSuspenseWrapper>
          </motion.div>
        );
      case "WEEKLY_ACTIVITY":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0"
          >
            <WidgetSuspenseWrapper title="Weekly Activity">
              <WeeklyActivityChart />
            </WidgetSuspenseWrapper>
          </motion.div>
        );
      case "ROUTINE_BALANCE":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0"
          >
            <WidgetSuspenseWrapper title="Category Balance">
              <RoutineBalanceChart />
            </WidgetSuspenseWrapper>
          </motion.div>
        );
      case "TIME_OF_DAY":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0"
          >
            <WidgetSuspenseWrapper title="Peak Focus Hours">
              <TimeOfDayChart />
            </WidgetSuspenseWrapper>
          </motion.div>
        );
      case "GOAL_PROGRESS":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0"
          >
            <WidgetSuspenseWrapper title="Weekly Goal Progress">
              <GoalProgressChart />
            </WidgetSuspenseWrapper>
          </motion.div>
        );
      case "HISTORY":
        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full min-w-0 min-h-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#A6A399] bg-[#F7FCFB]"
          >
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-[#323643]">History is always at the bottom</p>
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
            className="w-full h-full min-w-0 min-h-0 flex flex-col items-center justify-center bg-linear-to-br from-[#E1F4F3]/30 to-[#E1F4F3]/10 border-2 border-dashed border-[#A6A399] rounded-2xl"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#E1F4F3]/50 flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-[#706C61]" />
              </div>
              <p className="text-[#323643] font-semibold text-sm">No widget selected</p>
              <p className="text-[#706C61] text-xs mt-1">Add a widget to customize your dashboard</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    // Replaced the heavy padding/borders here with a layout-safe flex container
    <div className="w-full h-full min-w-0 min-h-0">
      {renderWidget()}
    </div>
  );
};

export default DashboardWidget;
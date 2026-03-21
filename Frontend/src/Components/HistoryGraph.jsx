import { motion } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import { CalendarDays, Loader2 } from "lucide-react";

/* Generate day labels for 30 days cycling Mon–Sun */
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const buildDayLabels = (count) => Array.from({ length: count }, (_, i) => SHORT_DAYS[i % 7]);

const HistoryGraph = () => {
  const { history, gettingHistory } = useTask();

  /* ── Loading ── */
  if (gettingHistory) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-7 h-7 text-[#333333] animate-spin" />
        <p className="text-sm text-[#706C61]">Loading history…</p>
      </div>
    );
  }

  /* ── Empty ── */
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E1F4F3] flex items-center justify-center">
          <CalendarDays className="w-8 h-8 text-[#706C61]" />
        </div>
        <div className="text-center">
          <p className="text-[#333333] font-semibold text-sm">No history yet</p>
          <p className="text-[#706C61] text-xs mt-1">Complete a routine to see your activity grid.</p>
        </div>
      </div>
    );
  }

  /* Determine column count from data (defaults to 30) */
  const colCount = history[0]?.weekHistory?.length || 30;
  const dayLabels = buildDayLabels(colCount);

  /* Fixed dimensions */
  const SQUARE_PX = 24; // w-6 h-6
  const GAP_PX = 4;
  const LABEL_COL_W = 200; // sticky left label width

  return (
    <div className="overflow-x-auto">
      <table className="border-separate" style={{ borderSpacing: `${GAP_PX}px` }}>
        {/* ── Header: Day labels ── */}
        <thead>
          <tr>
            {/* Sticky label column spacer */}
            <th
              className="sticky left-0 z-10 bg-[#FFFFFF]"
              style={{ minWidth: LABEL_COL_W, width: LABEL_COL_W }}
            />
            {dayLabels.map((day, i) => (
              <th
                key={i}
                className="text-[10px] font-medium text-[#706C61] uppercase tracking-wider text-center pb-1"
                style={{ width: SQUARE_PX, minWidth: SQUARE_PX }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body: one row per task ── */}
        <tbody>
          {history.map((task, rowIdx) => {
            const name = task.taskName || task.name || `Task ${rowIdx + 1}`;
            const time =
              task.startTime && task.endTime
                ? `${task.startTime} – ${task.endTime}`
                : null;

            return (
              <motion.tr
                key={task._id || rowIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: rowIdx * 0.03 }}
              >
                {/* Sticky task label */}
                <td
                  className="sticky left-0 z-10 bg-[#FFFFFF] pr-3 py-0.5 text-right align-middle"
                  style={{ minWidth: LABEL_COL_W, width: LABEL_COL_W }}
                >
                  <p className="text-xs sm:text-sm font-medium text-[#333333] leading-tight truncate">
                    {name}
                  </p>
                  {time && (
                    <p className="text-[10px] text-[#706C61] leading-tight mt-0.5">
                      {time}
                    </p>
                  )}
                </td>

                {/* 30 daily squares */}
                {(task.weekHistory || []).map((day, colIdx) => (
                  <td key={colIdx} className="p-0 align-middle">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15, delay: rowIdx * 0.03 + colIdx * 0.008 }}
                      whileHover={{ scale: 1.35 }}
                      title={`${dayLabels[colIdx]} (Day ${colIdx + 1}): ${day.completed ? "Completed ✓" : "Missed"}`}
                      className={`rounded-sm cursor-default transition-colors duration-150 ${
                        day.completed ? "bg-[#333333]" : "bg-[#E1F4F3]"
                      }`}
                      style={{ width: SQUARE_PX, height: SQUARE_PX }}
                    />
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Legend ── */}
      <div className="flex items-center justify-end gap-4 pt-4 pr-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#E1F4F3]" />
          <span className="text-[10px] text-[#706C61]">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#333333]" />
          <span className="text-[10px] text-[#706C61]">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryGraph;
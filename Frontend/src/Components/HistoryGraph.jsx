/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import { CalendarDays, Loader2, Pencil, Trash2, X, Save } from "lucide-react";
import toast from "react-hot-toast";

const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const buildDayLabels = (count) => Array.from({ length: count }, (_, i) => SHORT_DAYS[i % 7]);

const HistoryGraph = () => {
  const { 
    history, 
    gettingHistory, 
    deleteSingleTask, 
    updateSingleTask, 
    toggleRoutineForToday, 
    getHistoryForGraph, 
    getStatsForGraph, 
    togglingRoutineForToday,
    updatingSingleTask,
    deletingSingleTask
  } = useTask();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", startTime: "", endTime: "" });

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete task?")) {
      await deleteSingleTask(taskId);
      await getHistoryForGraph();
      await getStatsForGraph();
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.taskName || task.name || "",
      startTime: task.startTime || "",
      endTime: task.endTime || ""
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.startTime || !editForm.endTime) {
      toast.error("Please fill all fields.");
      return;
    }

    const formatTime = (timeStr) => timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;

    const payload = {
      title: editForm.title,
      startTime: formatTime(editForm.startTime),
      endTime: formatTime(editForm.endTime)
    };
      
    const targetId = editingTask.taskId || editingTask.id;
    await updateSingleTask(payload, targetId);
    setEditModalOpen(false);
    await getHistoryForGraph();
    await getStatsForGraph();
  };

  const handleToggle = async (taskId) => {
    if (togglingRoutineForToday) return;
    await toggleRoutineForToday(taskId);
    await getHistoryForGraph();
    await getStatsForGraph();
  };

  const isInteractive = (dayDateStr) => {
    if (!dayDateStr) return false;
    
    // Only check if the date is Today (ignore the time window)
    const todayObj = new Date();
    const yyyy = todayObj.getFullYear();
    const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
    const dd = String(todayObj.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    return dayDateStr.substring(0, 10) === todayStr;
  };

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
  const LABEL_COL_W = 240; // widened for action buttons

  return (
    <div className="overflow-x-auto relative pb-2 min-h-[250px]">
      <table className="border-separate table-auto" style={{ borderSpacing: `${GAP_PX}px` }}>
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
                style={{ width: SQUARE_PX, minWidth: SQUARE_PX, maxWidth: SQUARE_PX }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body: one row per task ── */}
        <tbody>
          {history.map((task, rowIdx) => {
            const taskId = task.taskId || task.id; 
            const name = task.title || `Task ${rowIdx + 1}`;
            const time = task.startTime && task.endTime ? `${task.startTime} – ${task.endTime}` : null;

            return (
              <motion.tr
                key={taskId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: rowIdx * 0.03 }}
              >
                {/* Sticky task label */}
                <td
                  className="sticky left-0 z-10 bg-[#FFFFFF] pr-3 py-1 align-middle"
                  style={{ minWidth: LABEL_COL_W, width: LABEL_COL_W, maxWidth: LABEL_COL_W }}
                >
                  <div className="flex items-center justify-between w-full h-full gap-2 pl-1">
                    <div className="flex-1 min-w-0 pr-1 truncate text-right">
                      <p className="text-xs sm:text-sm font-medium text-[#333333] leading-tight truncate">
                        {name}
                      </p>
                      {time && (
                        <p className="text-[10px] text-[#706C61] leading-tight mt-0.5">
                          {time}
                        </p>
                      )}
                    </div>
                    {/* Y-Axis CRUD Actions */}
                    <div className="flex items-center gap-1 shrink-0 bg-[#FAFAFA] rounded-md p-1 border border-[#E1F4F3]">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded bg-transparent hover:bg-[#E1F4F3] border-none flex items-center justify-center cursor-pointer transition-colors group"
                        title="Edit Task"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#706C61] group-hover:text-[#333333]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(taskId)}
                        disabled={deletingSingleTask}
                        className="p-1.5 rounded bg-transparent hover:bg-red-50 border-none flex items-center justify-center cursor-pointer transition-colors group disabled:opacity-50"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#706C61] group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </td>

                {/* 30 daily squares */}
                {(task.weekHistory || []).map((day, colIdx) => {
                  const interactive = isInteractive(day.date, task.startTime, task.endTime);
                  
                  return (
                    <td key={colIdx} className="p-0 align-middle text-center w-[24px]">
                      {interactive ? (
                        <motion.button
                          onClick={() => handleToggle(taskId)}
                          disabled={togglingRoutineForToday}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.15, delay: rowIdx * 0.03 + colIdx * 0.008 }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          title={`Toggle ${name} (Today's task!)`}
                          className={`w-[24px] h-[24px] p-0 border-none rounded-[4px] cursor-pointer shadow-sm transition-all duration-150 relative disabled:cursor-wait ${
                            day.completed ? "bg-[#333333] hover:opacity-85" : "bg-white border-2 border-[#333333] hover:bg-[#E1F4F3]"
                          }`}
                        >
                          {day.completed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-sm bg-white/30" />
                            </div>
                          )}
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.15, delay: rowIdx * 0.03 + colIdx * 0.008 }}
                          title={
                            day.date 
                              ? `${day.date}: ${day.completed ? "Completed ✓" : "Missed"}` 
                              : `Day ${colIdx + 1}: ${day.completed ? "Completed ✓" : "Missed"}`
                          }
                          className={`mx-auto rounded-[4px] cursor-not-allowed transition-colors duration-150 ${
                            day.completed ? "bg-[#333333]/80" : "bg-[#E1F4F3]"
                          }`}
                          style={{ width: SQUARE_PX, height: SQUARE_PX }}
                        />
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Legend ── */}
      <div className="flex items-center justify-end gap-4 pt-4 pr-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#E1F4F3]" />
          <span className="text-[10px] text-[#706C61]">Missed / Inactive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border-2 border-[#333333] rounded-sm bg-white box-border" />
          <span className="text-[10px] text-[#706C61]">Available (Today & Now)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#333333]/80" />
          <span className="text-[10px] text-[#706C61]">Completed</span>
        </div>
      </div>

      {/* ── Edit Task Modal ── */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setEditModalOpen(false)}
              className="absolute inset-0 bg-[#333333]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E1F4F3] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#FFFFFF] border-b border-[#E1F4F3] px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#333333]">Edit Task</h2>
                  <p className="text-xs text-[#706C61] mt-0.5">Update task configuration.</p>
                </div>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 rounded-full hover:bg-[#E1F4F3] text-[#706C61] transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#706C61] mb-1">Task Title</label>
                    <input 
                      type="text" 
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                      className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#333333] transition-colors text-[#333333] text-sm bg-[#FAFAFA]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-[#706C61] mb-1">Start Time</label>
                      <input 
                        type="time" 
                        required
                        step="1"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm(prev => ({...prev, startTime: e.target.value}))}
                        className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#333333] transition-colors text-[#333333] text-sm bg-[#FAFAFA]"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-[#706C61] mb-1">End Time</label>
                      <input 
                        type="time" 
                        required
                        step="1"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm(prev => ({...prev, endTime: e.target.value}))}
                        className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#333333] transition-colors text-[#333333] text-sm bg-[#FAFAFA]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-[#E1F4F3]">
                    <button 
                      type="submit" 
                      disabled={updatingSingleTask}
                      className="flex items-center gap-2 text-sm font-medium text-[#FFFFFF] bg-[#333333] hover:bg-[#1a1a1a] px-6 py-2 rounded-lg transition-all cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {updatingSingleTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Update Task
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryGraph;
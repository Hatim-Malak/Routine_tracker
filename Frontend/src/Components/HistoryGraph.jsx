/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTask } from "../Store/UseTaskStore";
import { CalendarDays, Loader2, Pencil, Trash2, X, Save } from "lucide-react";
import toast from "react-hot-toast";

const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const buildDayLabels = (count) => Array.from({ length: count }, (_, i) => SHORT_DAYS[i % 7]);

const HistoryGraph = ({ isEmbedded = false }) => {
  const history = useTask((s) => s.history);
  const gettingHistory = useTask((s) => s.gettingHistory);
  const deleteSingleTask = useTask((s) => s.deleteSingleTask);
  const updateSingleTask = useTask((s) => s.updateSingleTask);
  const toggleRoutineForToday = useTask((s) => s.toggleRoutineForToday);
  const getHistoryForGraph = useTask((s) => s.getHistoryForGraph);
  const getStatsForGraph = useTask((s) => s.getStatsForGraph);
  const togglingRoutineForToday = useTask((s) => s.togglingRoutineForToday);
  const updatingSingleTask = useTask((s) => s.updatingSingleTask);
  const deletingSingleTask = useTask((s) => s.deletingSingleTask);

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
      <div className="flex flex-col items-center justify-center py-16 gap-3 w-full h-full min-h-[200px]">
        <Loader2 className="w-7 h-7 text-[#333333] animate-spin" />
        <p className="text-sm text-[#706C61]">Loading history…</p>
      </div>
    );
  }

  /* ── Empty ── */
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 w-full h-full min-h-[200px]">
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

  const colCount = history[0]?.weekHistory?.length || 30;
  const dayLabels = buildDayLabels(colCount);

  const SQUARE_SIZE = 24; 
  const LABEL_WIDTH = 220; 

  return (
    <div className={`relative w-full ${isEmbedded ? "max-h-96" : "min-h-62.5"}`}>
      
      {/* ── Scroll Area Wrapper ── */}
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <table className="border-separate table-fixed" style={{ borderSpacing: '4px 8px' }}>
          
          <thead>
            <tr>
              {/* Sticky Heading column pane */}
              <th 
                className="sticky left-0 z-20 bg-white shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
              ></th>
              
              {dayLabels.map((day, i) => (
                <th 
                  key={i} 
                  className="text-[10px] font-medium text-[#706C61] uppercase tracking-wider text-center pb-1"
                  style={{ width: SQUARE_SIZE, minWidth: SQUARE_SIZE }}
                >
                  {day.charAt(0)}
                </th>
              ))}
            </tr>
          </thead>

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
                  {/* Sticky Label Block Layer */}
                  <td 
                    className="sticky left-0 z-20 bg-white pr-4 py-1 align-middle shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]"
                    style={{ width: LABEL_WIDTH, minWidth: LABEL_WIDTH }}
                  >
                    <div className="flex items-center justify-between w-full h-full gap-2 pl-1">
                      <div className="flex-1 min-w-0 pr-1 truncate text-right">
                        <p className="text-xs sm:text-sm font-semibold text-[#323643] leading-tight truncate">
                          {name}
                        </p>
                        {time && (
                          <p className="text-[10px] text-[#706C61] leading-tight mt-0.5">
                            {time}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0 bg-[#FAFAFA] rounded-md p-1 border border-[#E1F4F3]">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-1.5 rounded bg-transparent hover:bg-[#E1F4F3] border-none flex items-center justify-center cursor-pointer transition-colors group"
                          title="Edit Task"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#706C61] group-hover:text-[#323643]" />
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

                  {/* Contribution Cells */}
                  {(task.weekHistory || []).map((day, colIdx) => {
                    const interactive = isInteractive(day.date);
                    
                    return (
                      <td key={colIdx} className="p-0 align-middle text-center" style={{ width: SQUARE_SIZE, minWidth: SQUARE_SIZE }}>
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
                            style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }}
                            className={`mx-auto p-0 border-none rounded-[4px] cursor-pointer shadow-sm transition-all duration-150 relative disabled:cursor-wait ${
                              day.completed ? "bg-[#323643] hover:opacity-85" : "bg-white border-2 border-[#323643] hover:bg-[#E1F4F3]"
                            }`}
                          >
                            {day.completed && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-[2px] bg-white/40" />
                              </div>
                            )}
                          </motion.button>
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.15, delay: rowIdx * 0.03 + colIdx * 0.008 }}
                            title={day.date ? `${day.date}: ${day.completed ? "Completed" : "Missed"}` : ""}
                            style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }}
                            className={`mx-auto rounded-[4px] cursor-not-allowed transition-colors duration-150 ${
                              day.completed ? "bg-[#323643]/80" : "bg-[#E1F4F3]"
                            }`}
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
      </div>

      {/* Legend Block */}
      <div className="flex flex-wrap items-center justify-end gap-4 pt-2 pr-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-[#E1F4F3]" />
          <span className="text-[10px] text-[#706C61]">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border-2 border-[#323643] rounded-[3px] bg-white box-border" />
          <span className="text-[10px] text-[#706C61]">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-[#323643]/80" />
          <span className="text-[10px] text-[#706C61]">Completed</span>
        </div>
      </div>

      {/* Edit Form Modal Overlay */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setEditModalOpen(false)}
              className="absolute inset-0 bg-[#323643]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative bg-[#FFFFFF] rounded-3xl shadow-xl border border-[#E1F4F3] w-full max-w-lg overflow-hidden"
            >
              <div className="bg-[#FFFFFF] border-b border-[#E1F4F3] px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#323643]">Edit Task</h2>
                  <p className="text-xs font-medium text-[#706C61] mt-1">Update task configuration.</p>
                </div>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 rounded-full hover:bg-[#E1F4F3] text-[#706C61] transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-2">Task Title</label>
                    <input 
                      type="text" 
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                      className="w-full px-4 py-3 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] transition-colors text-[#323643] font-medium text-sm bg-[#FAFAFA]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-2">Start Time</label>
                      <input 
                        type="time" 
                        required
                        step="1"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm(prev => ({...prev, startTime: e.target.value}))}
                        className="w-full px-4 py-3 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] transition-colors text-[#323643] font-medium text-sm bg-[#FAFAFA]"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-2">End Time</label>
                      <input 
                        type="time" 
                        required
                        step="1"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm(prev => ({...prev, endTime: e.target.value}))}
                        className="w-full px-4 py-3 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] transition-colors text-[#323643] font-medium text-sm bg-[#FAFAFA]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-5 border-t border-[#E1F4F3]">
                    <button 
                      type="submit" 
                      disabled={updatingSingleTask}
                      className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] bg-[#323643] hover:bg-[#1a1c23] px-8 py-3 rounded-xl transition-all cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {updatingSingleTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
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
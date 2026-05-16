import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Store/UseAuthStore";
import { useTask } from "../Store/UseTaskStore";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, LayoutDashboard, LogOut, Menu, X, Trash2, RefreshCw, Plus, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const { history, deleteRoutine, updateAllandresettask, getHistoryForGraph, getStatsForGraph, updatingAllTask } = useTask();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [tasks, setTasks] = useState([{ title: "", startTime: "", endTime: "" }]);

  const isActive = (path) => location.pathname === path;

  // Pre-fill tasks when opening modal
  useEffect(() => {
    if (isUpdateModalOpen) {
      if (history && history.length > 0) {
        // Map history to task objects
        const prefilledTasks = history.map(h => ({
          title: h.taskName || h.name || "",
          startTime: h.startTime || "",
          endTime: h.endTime || ""
        }));
        setTasks(prefilledTasks);
      } else {
        setTasks([{ title: "", startTime: "", endTime: "" }]);
      }
    }
  }, [isUpdateModalOpen, history]);

  const handleDeleteRoutine = async () => {
    if (window.confirm("Are you sure you want to delete the entire routine? This action cannot be undone.")) {
      await deleteRoutine();
      await getHistoryForGraph();
      await getStatsForGraph();
    }
  };

  const handleAddRow = () => setTasks([...tasks, { title: "", startTime: "", endTime: "" }]);
  
  const handleRemoveRow = (index) => {
    if (tasks.length > 1) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };

  const handleChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleUpdateRoutine = async (e) => {
    e.preventDefault();
    for (let t of tasks) {
      if (!t.title.trim() || !t.startTime || !t.endTime) {
        toast.error("Please fill all fields for every task.");
        return;
      }
    }

    const payload = tasks.map(t => {
      const formatTime = (timeStr) => timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
      return {
        title: t.title,
        startTime: formatTime(t.startTime),
        endTime: formatTime(t.endTime)
      };
    });

    await updateAllandresettask(payload);
    setIsUpdateModalOpen(false);
    await getHistoryForGraph();
    await getStatsForGraph();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FFFFFF]/70 backdrop-blur-xl border-b border-[#E1F4F3] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Left: User avatar + greeting ── */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E1F4F3] flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-[#333333]" />
              </div>
              <span className="font-bold text-xl text-[#333333]">
                Hi, {authUser?.username || "User"} 
              </span>
            </div>

            {/* ── Desktop Links ── */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={handleDeleteRoutine}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#706C61] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border border-transparent"
                title="Delete Entire Routine"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden lg:inline">Delete Routine</span>
              </button>
              
              <button 
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#706C61] hover:text-[#333333] hover:bg-[#E1F4F3]/50 transition-colors cursor-pointer bg-transparent border border-[#E1F4F3]"
                title="Reset/Update Routine"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden lg:inline">Update Routine</span>
              </button>

              <Link to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                  isActive("/dashboard") ? "bg-[#E1F4F3] text-[#333333]" : "text-[#706C61] hover:text-[#333333] hover:bg-[#E1F4F3]/50"
                }`}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#706C61] hover:text-[#333333] hover:bg-red-50 transition-all duration-200 cursor-pointer bg-transparent border-none">
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>

            {/* ── Mobile hamburger ── */}
            <button onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-[#333333] hover:bg-[#E1F4F3] transition-colors bg-transparent border-none cursor-pointer">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-[#E1F4F3] bg-[#FFFFFF]/90 backdrop-blur-xl">
              <div className="px-4 py-3 flex flex-col gap-1">
                <button onClick={() => { setMobileOpen(false); setIsUpdateModalOpen(true); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#706C61] hover:text-[#333333] hover:bg-[#E1F4F3]/50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                  <RefreshCw className="w-4 h-4" />
                  Update Routine
                </button>
                <button onClick={() => { setMobileOpen(false); handleDeleteRoutine(); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                  <Trash2 className="w-4 h-4" />
                  Delete Routine
                </button>
                <hr className="border-[#E1F4F3] my-1" />
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                    isActive("/dashboard") ? "bg-[#E1F4F3] text-[#333333]" : "text-[#706C61] hover:text-[#333333] hover:bg-[#E1F4F3]/50"
                  }`}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#706C61] hover:text-[#333333] hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Update Routine Modal ── */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute inset-0 bg-[#111827]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 18 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.96, opacity: 0, y: 18 }} 
              className="relative w-full max-w-4xl max-h-[calc(100vh-3rem)] overflow-hidden rounded-[28px] bg-[#FFFFFF] border border-[#E1F4F3] shadow-[0_28px_100px_rgba(51,51,51,0.14)]"
            >
              <div className="sticky top-0 z-10 border-b border-[#E1F4F3] bg-[#FFFFFF] px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.32em] text-[#706C61]">Task builder</p>
                    <h2 className="text-2xl font-semibold text-[#111827]">Update Routine</h2>
                    <p className="max-w-2xl text-sm text-[#475158]">Match the look and feel of your routine builder while keeping the form compact and easy to scan.</p>
                  </div>
                  <button 
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E1F4F3] bg-[#F7FCFB] text-[#706C61] transition-colors hover:bg-[#E1F4F3]"
                    aria-label="Close update modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-14rem)] overflow-y-auto p-6 space-y-6">
                <div className="rounded-[24px] border border-[#E1F4F3] bg-[#F7FCFB] p-5 shadow-sm">
                  <p className="text-sm font-semibold text-[#333333]">Quick guide</p>
                  <p className="mt-2 text-sm leading-6 text-[#706C61]">Keep each task compact and consistent. If inputs stretch too wide, the modal stays contained and responsive.</p>
                </div>

                <form onSubmit={handleUpdateRoutine} className="space-y-5">
                  {tasks.map((task, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-[24px] border border-[#E1F4F3] bg-[#FAFAFA] p-5 shadow-sm transition hover:shadow-md">
                      <div className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#333333] text-[10px] font-bold text-white shadow-sm">{idx + 1}</div>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#706C61] mb-2">Task title</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g., Morning Workout"
                            value={task.title}
                            onChange={(e) => handleChange(idx, "title", e.target.value)}
                            className="w-full rounded-2xl border-2 border-[#E1F4F3] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#333333] focus:bg-white"
                          />
                        </div>

                        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[480px]">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#706C61] mb-2">Start time</label>
                            <input 
                              type="time" 
                              required
                              value={task.startTime}
                              onChange={(e) => handleChange(idx, "startTime", e.target.value)}
                              className="w-full rounded-2xl border-2 border-[#E1F4F3] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#333333] focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#706C61] mb-2">End time</label>
                            <input 
                              type="time" 
                              required
                              value={task.endTime}
                              onChange={(e) => handleChange(idx, "endTime", e.target.value)}
                              className="w-full rounded-2xl border-2 border-[#E1F4F3] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#333333] focus:bg-white"
                            />
                          </div>
                        </div>

                        {tasks.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRow(idx)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E1F4F3] bg-white text-[#706C61] transition hover:bg-[#F5F7F9] hover:text-red-500"
                            title="Remove task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button 
                      type="button" 
                      onClick={handleAddRow}
                      className="flex items-center justify-center gap-2 rounded-full border border-[#E1F4F3] bg-[#F7FCFB] px-5 py-3 text-sm font-semibold text-[#333333] transition hover:bg-[#E1F4F3]"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Task
                    </button>

                    <button 
                      type="submit" 
                      disabled={updatingAllTask}
                      className="flex items-center justify-center gap-2 rounded-full bg-[#333333] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#323643]/15 transition hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updatingAllTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Routine
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
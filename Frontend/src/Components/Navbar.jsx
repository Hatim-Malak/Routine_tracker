import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Store/UseAuthStore";
import { useTask } from "../Store/UseTaskStore";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, LogOut, Menu, X, Trash2, RefreshCw, Plus, Save, Loader2, Settings, Bell } from "lucide-react";
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
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-xl border-b border-[#E1F4F3]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* ── Left: Logo & Main Navigation ── */}
            <div className="flex items-center h-full gap-8 lg:gap-12">
              {/* Brand Logo */}
              <Link to="/dashboard" className="flex items-center flex-shrink-0 no-underline">
                <span className="text-[22px] font-extrabold text-[#323643] tracking-tight">RoutineX</span>
              </Link>

              {/* Desktop Links (OptimaTrack Style) */}
              <div className="hidden md:flex items-center h-full gap-6 lg:gap-8">
                <Link to="/dashboard" className={`h-full flex items-center border-b-2 px-1 text-sm font-semibold transition-colors duration-200 no-underline ${
                  isActive("/dashboard") ? "border-[#323643] text-[#323643]" : "border-transparent text-[#706C61] hover:text-[#323643] hover:border-[#E1F4F3]"
                }`}>
                  Dashboard
                </Link>
                <Link to="/analytics" className={`h-full flex items-center border-b-2 px-1 text-sm font-semibold transition-colors duration-200 no-underline ${
                  isActive("/analytics") ? "border-[#323643] text-[#323643]" : "border-transparent text-[#706C61] hover:text-[#323643] hover:border-[#E1F4F3]"
                }`}>
                  Analytics
                </Link>
                <Link to="/journal" className={`h-full flex items-center border-b-2 px-1 text-sm font-semibold transition-colors duration-200 no-underline ${
                  isActive("/journal") ? "border-[#323643] text-[#323643]" : "border-transparent text-[#706C61] hover:text-[#323643] hover:border-[#E1F4F3]"
                }`}>
                  Journal
                </Link>
                <Link to="/community" className={`h-full flex items-center border-b-2 px-1 text-sm font-semibold transition-colors duration-200 no-underline ${
                  isActive("/community") ? "border-[#323643] text-[#323643]" : "border-transparent text-[#706C61] hover:text-[#323643] hover:border-[#E1F4F3]"
                }`}>
                  Community
                </Link>
              </div>
            </div>

            {/* ── Right: Action Icons & User Profile ── */}
            <div className="hidden md:flex items-center gap-3 lg:gap-5">
              
              {/* Notification Placeholder */}
              <button className="p-2 text-[#706C61] hover:text-[#323643] transition-colors cursor-pointer bg-transparent border-none" title="Notifications">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Update Routine mapped to Settings Icon */}
              <button 
                onClick={() => setIsUpdateModalOpen(true)} 
                className="p-2 text-[#706C61] hover:text-[#323643] transition-colors cursor-pointer bg-transparent border-none" 
                title="Update Routine / Settings"
              >
                <Settings className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Delete Routine mapped to Trash Icon */}
              <button 
                onClick={handleDeleteRoutine} 
                className="p-2 text-[#706C61] hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none" 
                title="Delete Entire Routine"
              >
                <Trash2 className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Thin vertical separator */}
              <div className="w-px h-6 bg-[#E1F4F3] mx-1"></div>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-3 ml-1">
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-1 rounded-full transition-all"
                  title="Click to Logout"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E1F4F3] flex items-center justify-center border border-[#323643]/10 overflow-hidden group-hover:border-red-200 group-hover:bg-red-50 transition-colors">
                    <UserCircle className="w-8 h-8 text-[#323643] group-hover:text-red-500 transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="hidden lg:block text-sm font-bold text-[#323643] group-hover:text-red-500 transition-colors">
                    {authUser?.username || "User"}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Mobile hamburger ── */}
            <button onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-[#323643] hover:bg-[#E1F4F3] transition-colors bg-transparent border-none cursor-pointer">
              {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-[#E1F4F3] bg-[#FAFAFA]/95 backdrop-blur-xl shadow-lg">
              <div className="px-4 py-4 flex flex-col gap-1">
                
                {/* User Greeting Mobile */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-[#E1F4F3]/30 rounded-xl">
                  <UserCircle className="w-8 h-8 text-[#323643]" strokeWidth={1.5} />
                  <span className="font-bold text-sm text-[#323643]">{authUser?.username || "User"}</span>
                </div>

                {/* Mobile Links */}
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors no-underline ${
                    isActive("/dashboard") ? "bg-[#323643] text-white" : "text-[#706C61] hover:text-[#323643] hover:bg-[#E1F4F3]/50"
                  }`}>
                  Dashboard
                </Link>
                <Link to="/analytics" onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors no-underline ${
                    isActive("/analytics") ? "bg-[#323643] text-white" : "text-[#706C61] hover:text-[#323643] hover:bg-[#E1F4F3]/50"
                  }`}>
                  Analytics
                </Link>

                <hr className="border-[#E1F4F3] my-2 mx-2" />

                {/* Action Buttons Mobile */}
                <button onClick={() => { setMobileOpen(false); setIsUpdateModalOpen(true); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#706C61] hover:text-[#323643] hover:bg-[#E1F4F3]/50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                  <Settings className="w-5 h-5" strokeWidth={1.5} />
                  Update Routine & Settings
                </button>
                <button onClick={() => { setMobileOpen(false); handleDeleteRoutine(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                  <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                  Delete Routine
                </button>
                <button onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#706C61] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
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
              className="absolute inset-0 bg-[#323643]/30 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 18 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.96, opacity: 0, y: 18 }} 
              className="relative w-full max-w-4xl max-h-[calc(100vh-3rem)] overflow-hidden rounded-[28px] bg-[#FFFFFF] border border-[#E1F4F3] shadow-2xl"
            >
              <div className="sticky top-0 z-10 border-b border-[#E1F4F3] bg-[#FFFFFF] px-6 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#706C61]">Task builder</p>
                    <h2 className="text-2xl font-extrabold text-[#323643]">Update Routine</h2>
                    <p className="max-w-2xl text-sm font-medium text-[#706C61]">Match the look and feel of your routine builder while keeping the form compact and easy to scan.</p>
                  </div>
                  <button 
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E1F4F3] bg-[#FAFAFA] text-[#706C61] transition-colors hover:bg-[#E1F4F3] hover:text-[#323643] cursor-pointer"
                    aria-label="Close update modal"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-14rem)] overflow-y-auto p-6 space-y-6">
                <div className="rounded-[20px] border border-[#E1F4F3] bg-[#E1F4F3]/30 p-5 shadow-sm">
                  <p className="text-sm font-bold text-[#323643]">Quick guide</p>
                  <p className="mt-1 text-sm leading-6 text-[#706C61] font-medium">Keep each task compact and consistent. If inputs stretch too wide, the modal stays contained and responsive.</p>
                </div>

                <form onSubmit={handleUpdateRoutine} className="space-y-5">
                  {tasks.map((task, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-[20px] border border-[#E1F4F3] bg-[#FAFAFA] p-5 shadow-sm transition hover:shadow-md">
                      <div className="absolute -top-2.5 -left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#323643] text-[10px] font-bold text-white shadow-md border-2 border-white">{idx + 1}</div>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#706C61] mb-2">Task title</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g., Morning Workout"
                            value={task.title}
                            onChange={(e) => handleChange(idx, "title", e.target.value)}
                            className="w-full rounded-2xl border-2 border-[#E1F4F3] bg-white px-4 py-3 text-sm font-semibold text-[#323643] outline-none transition focus:border-[#323643] focus:bg-white placeholder-[#A6A399]"
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
                              className="w-full rounded-2xl border-2 border-[#E1F4F3] bg-white px-4 py-3 text-sm font-semibold text-[#323643] outline-none transition focus:border-[#323643] focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#706C61] mb-2">End time</label>
                            <input 
                              type="time" 
                              required
                              value={task.endTime}
                              onChange={(e) => handleChange(idx, "endTime", e.target.value)}
                              className="w-full rounded-2xl border-2 border-[#E1F4F3] bg-white px-4 py-3 text-sm font-semibold text-[#323643] outline-none transition focus:border-[#323643] focus:bg-white"
                            />
                          </div>
                        </div>

                        {tasks.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRow(idx)}
                            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-transparent bg-transparent text-[#706C61] transition hover:bg-red-50 hover:border-red-100 hover:text-red-500 cursor-pointer shrink-0"
                            title="Remove task"
                          >
                            <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-[#E1F4F3]/60">
                    <button 
                      type="button" 
                      onClick={handleAddRow}
                      className="flex items-center justify-center gap-2 rounded-xl border border-transparent bg-[#E1F4F3]/60 px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-[#323643] transition hover:bg-[#E1F4F3] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                      Add Layer
                    </button>

                    <button 
                      type="submit" 
                      disabled={updatingAllTask}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#323643] px-7 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#323643]/15 transition hover:bg-[#1f2129] disabled:cursor-not-allowed disabled:opacity-70 border-none cursor-pointer"
                    >
                      {updatingAllTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" strokeWidth={2.5} />}
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
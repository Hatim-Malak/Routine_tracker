/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTask } from "../Store/UseTaskStore";
import { Plus, Trash2, ArrowLeft, Loader2, Save, Layers } from "lucide-react";
import Seo from "../Components/Seo";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AVAILABLE_CATEGORIES = ["Fitness", "Study", "Chores", "Work"];

const CreateRoutine = () => {
  const [tasks, setTasks] = useState([{ title: "", category: "Fitness", startTime: "", endTime: "" }]);
  const { createTask, getHistoryForGraph, getStatsForGraph, creatingTask } = useTask();
  const navigate = useNavigate();
  
  const handleAddRow = () => {
    setTasks([...tasks, { title: "", category: "Fitness", startTime: "", endTime: "" }]);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    for (let t of tasks) {
      if (!t.title.trim() || !t.category || !t.startTime || !t.endTime) {
        toast.error("Please fill all fields for every task.");
        return;
      }
    }

    const payload = tasks.map(t => {
      const formatTime = (timeStr) => {
        return timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
      };

      return {
        title: t.title,
        category: t.category,
        startTime: formatTime(t.startTime),
        endTime: formatTime(t.endTime)
      };
    });

    await createTask(payload);
    await getHistoryForGraph();
    await getStatsForGraph();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Seo
        title="Create Routine — RoutineX"
        description="Design a new routine with time-blocked tasks and build consistent streaks."
        url="https://example.com/create-routine"
        canonical="https://example.com/create-routine"
      />
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-[#E1F4F3]/60 pb-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="p-2.5 rounded-xl bg-white border border-[#E1F4F3] hover:bg-[#E1F4F3]/40 text-[#323643] transition-all duration-200 shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-[#323643] tracking-tight">Create Routine</h1>
              <p className="text-xs text-[#706C61] font-medium mt-1">Design and timeline your daily performance structure.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#E1F4F3]/40 border border-[#E1F4F3] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#706C61]">
            <Layers className="w-3.5 h-3.5 text-[#323643]" />
            Batch Wizard
          </div>
        </div>

        {/* Central Workspace Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/2 border border-[#E1F4F3] p-6 sm:p-8 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rows Container */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {tasks.map((task, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -30 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="group relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-5 sm:p-6 border-l-4 border-l-[#323643] border border-[#E1F4F3] rounded-2xl bg-[#FAFAFA]/70 hover:bg-[#FAFAFA] transition-colors duration-200"
                  >
                    
                    {/* Floating sequence counter */}
                    <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-[#323643] text-white text-[10px] font-bold flex items-center justify-center shadow-md border-2 border-white">
                      {idx + 1}
                    </div>

                    {/* Task Title Input */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-[11px] font-bold text-[#706C61] uppercase tracking-wider mb-1.5">Task Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g., Core Architectural Design"
                        value={task.title}
                        onChange={(e) => handleChange(idx, "title", e.target.value)}
                        className="w-full px-3.5 py-2.5 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] focus:bg-white transition-all text-[#323643] text-sm bg-white/80 font-medium placeholder-[#A6A399]"
                      />
                    </div>

                    {/* Task Category Selection Dropdown */}
                    <div className="w-full lg:w-48">
                      <label className="block text-[11px] font-bold text-[#706C61] uppercase tracking-wider mb-1.5">Category</label>
                      <select
                        value={task.category}
                        onChange={(e) => handleChange(idx, "category", e.target.value)}
                        className="w-full px-3.5 py-2.5 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] focus:bg-white transition-all text-[#323643] text-sm bg-white/80 font-bold cursor-pointer appearance-none shadow-xs"
                      >
                        {AVAILABLE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            📁 {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Time Fields & Remove Target Group */}
                    <div className="w-full lg:w-auto flex items-end gap-3 justify-between">
                      <div className="w-full sm:w-28">
                        <label className="block text-[11px] font-bold text-[#706C61] uppercase tracking-wider mb-1.5">Start Time</label>
                        <input 
                          type="time" 
                          required
                          value={task.startTime}
                          onChange={(e) => handleChange(idx, "startTime", e.target.value)}
                          className="w-full px-3.5 py-2.5 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] focus:bg-white transition-all text-[#323643] text-sm bg-white/80 font-bold"
                        />
                      </div>
                      <div className="w-full sm:w-28">
                        <label className="block text-[11px] font-bold text-[#706C61] uppercase tracking-wider mb-1.5">End Time</label>
                        <input 
                          type="time" 
                          required
                          value={task.endTime}
                          onChange={(e) => handleChange(idx, "endTime", e.target.value)}
                          className="w-full px-3.5 py-2.5 border-2 border-[#E1F4F3] rounded-xl focus:outline-none focus:border-[#323643] focus:bg-white transition-all text-[#323643] text-sm bg-white/80 font-bold"
                        />
                      </div>

                      {tasks.length > 1 ? (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRow(idx)}
                          className="p-2.5 border-2 border-transparent text-[#706C61] hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                          title="Delete Row Window"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-10 h-10 hidden lg:block" />
                      )}
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Form Footer Action Utility Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mt-4 pt-5 border-t border-[#E1F4F3]/60">
              <button 
                type="button" 
                onClick={handleAddRow}
                className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#323643] bg-[#E1F4F3]/60 hover:bg-[#E1F4F3] px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer border-none shadow-xs"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Add Nested Layer
              </button>

              <button 
                type="submit" 
                disabled={creatingTask}
                className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] bg-[#323643] hover:bg-[#1f2129] px-7 py-3 rounded-xl transition-all duration-200 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#323643]/10"
              >
                {creatingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Deploy Architecture
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;
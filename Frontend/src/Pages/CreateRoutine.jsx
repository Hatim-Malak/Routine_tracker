/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTask } from "../Store/UseTaskStore";
import { Plus, Trash2, ArrowLeft, Loader2, Save } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
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
    
    // Validate empty fields
    for (let t of tasks) {
      if (!t.title.trim() || !t.category || !t.startTime || !t.endTime) {
        toast.error("Please fill all fields for every task.");
        return;
      }
    }

    const payload = tasks.map(t => {
      // Append :00 if missing seconds
      const formatTime = (timeStr) => {
        return timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
      };

      return {
        title: t.title,
        category: t.category, // Automatically bundles category string into backend request DTO
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
    <div className="min-h-screen bg-[#FFFFFF] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-[#E1F4F3] transition-colors border-none bg-transparent">
            <ArrowLeft className="w-5 h-5 text-[#323643]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#323643]">Create Routine</h1>
            <p className="text-sm text-[#706C61] mt-1">Set up your daily tasks, tags, and schedule.</p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E1F4F3] rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-4 border border-[#E1F4F3] rounded-xl bg-[#FAFAFA]">
                  
                  {/* Task Title Input */}
                  <div className="flex-2 w-full">
                    <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-1">Task Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Morning Workout"
                      value={task.title}
                      onChange={(e) => handleChange(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#323643] transition-colors text-[#323643] text-sm bg-[#FFFFFF] font-medium"
                    />
                  </div>

                  {/* Task Category Selection Dropdown */}
                  <div className="w-full lg:w-44">
                    <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={task.category}
                      onChange={(e) => handleChange(idx, "category", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#323643] transition-colors text-[#323643] text-sm bg-[#FFFFFF] font-medium cursor-pointer"
                    >
                      {AVAILABLE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Window Inputs & Action Wrapper */}
                  <div className="w-full lg:w-auto flex items-end gap-3 justify-between">
                    <div>
                      <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-1">Start</label>
                      <input 
                        type="time" 
                        required
                        value={task.startTime}
                        onChange={(e) => handleChange(idx, "startTime", e.target.value)}
                        className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#323643] transition-colors text-[#323643] text-sm bg-[#FFFFFF] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#706C61] uppercase tracking-wider mb-1">End</label>
                      <input 
                        type="time" 
                        required
                        value={task.endTime}
                        onChange={(e) => handleChange(idx, "endTime", e.target.value)}
                        className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#323643] transition-colors text-[#323643] text-sm bg-[#FFFFFF] font-medium"
                      />
                    </div>

                    {tasks.length > 1 ? (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveRow(idx)}
                        className="p-2 bg-transparent border-none rounded-lg text-[#706C61] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Remove Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : (
                      // Phantom divider grid block spacer to maintain consistent row layout grid alignment
                      <div className="w-9 h-9 hidden lg:block" />
                    )}
                  </div>

                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-[#E1F4F3]">
              <button 
                type="button" 
                onClick={handleAddRow}
                className="flex items-center gap-2 text-sm font-bold text-[#323643] bg-[#E1F4F3] hover:bg-[#d4f0ee] px-4 py-2 rounded-lg transition-all cursor-pointer border-none"
              >
                <Plus className="w-4 h-4" />
                Add Another Task
              </button>

              <button 
                type="submit" 
                disabled={creatingTask}
                className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] bg-[#323643] hover:bg-[#1f2129] px-6 py-2 rounded-lg transition-all cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {creatingTask ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Routine
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;
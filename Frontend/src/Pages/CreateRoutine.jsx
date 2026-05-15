import { useEffect, useState } from "react";
import { useTask } from "../Store/UseTaskStore";
import { Plus, Trash2, ArrowLeft, Loader2, Save } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const CreateRoutine = () => {
  const [tasks, setTasks] = useState([{ title: "", startTime: "", endTime: "" }]);
  const { createTask, getHistoryForGraph, getStatsForGraph, creatingTask } = useTask();
  const navigate = useNavigate();
  
  const handleAddRow = () => {
    setTasks([...tasks, { title: "", startTime: "", endTime: "" }]);
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
      if (!t.title.trim() || !t.startTime || !t.endTime) {
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
      <div className="max-w-3xl w-full">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-[#E1F4F3] transition-colors border-none bg-transparent">
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#333333]">Create Routine</h1>
            <p className="text-sm text-[#706C61] mt-1">Set up your daily tasks and schedule.</p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E1F4F3] rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border border-[#E1F4F3] rounded-xl bg-[#FAFAFA]">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-[#706C61] mb-1">Task Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Morning Workout"
                      value={task.title}
                      onChange={(e) => handleChange(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#333333] transition-colors text-[#333333] text-sm bg-[#FFFFFF]"
                    />
                  </div>
                  <div className="w-full sm:w-auto flex items-center gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#706C61] mb-1">Start Time</label>
                      <input 
                        type="time" 
                        required
                        value={task.startTime}
                        onChange={(e) => handleChange(idx, "startTime", e.target.value)}
                        className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#333333] transition-colors text-[#333333] text-sm bg-[#FFFFFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#706C61] mb-1">End Time</label>
                      <input 
                        type="time" 
                        required
                        value={task.endTime}
                        onChange={(e) => handleChange(idx, "endTime", e.target.value)}
                        className="w-full px-3 py-2 border border-[#E1F4F3] rounded-lg focus:outline-none focus:border-[#333333] transition-colors text-[#333333] text-sm bg-[#FFFFFF]"
                      />
                    </div>
                    {tasks.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveRow(idx)}
                        className="mt-5 p-2 bg-transparent border-none rounded-lg text-[#706C61] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove Task"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-[#E1F4F3]">
              <button 
                type="button" 
                onClick={handleAddRow}
                className="flex items-center gap-2 text-sm font-medium text-[#333333] bg-[#E1F4F3] hover:opacity-80 px-4 py-2 rounded-lg transition-all cursor-pointer border-none"
              >
                <Plus className="w-4 h-4" />
                Add Another Task
              </button>

              <button 
                type="submit" 
                disabled={creatingTask}
                className="flex items-center gap-2 text-sm font-medium text-[#FFFFFF] bg-[#333333] hover:bg-[#1a1a1a] px-6 py-2 rounded-lg transition-all cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed"
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
import { axiosInstance } from "../lib/axios"
import { toast } from "react-hot-toast"
import { create } from "zustand"

export const useTask = create((set, get) => ({
    tasks: [],
    history: [],
    stats: [],
    dashboardLayout: ["CONSISTENCY", "BREAKDOWN", "EMPTY", "EMPTY"],
    gettingStatsForGraph: false,
    creatingTask: false,
    deletingSingleTask: false,
    gettingHistory: false,
    deletingAllRoutine: false,
    updatingSingleTask: false,
    updatingAllTask: false,
    togglingRoutineForToday: false,
    gettingDashboardLayout: false,
    savingDashboardLayout: false,

    createTask: async (data) => {
        set({ creatingTask: true })
        try {
            const res = await axiosInstance.post("/task/create-task", data)
            set({ tasks: res.data })
            toast.success("Routine Created Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ creatingTask: false })
        }
    },
    
    updateSingleTask: async (data, taskId) => {
        set({ updatingSingleTask: true })
        try {
            const res = await axiosInstance.put(`/task/update/${taskId}`, data)
            toast.success("Routine task updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ updatingSingleTask: false })
        }
    },

    updateAllandresettask: async (data) => {
        set({ updatingAllTask: true })
        try {
            const res = await axiosInstance.put("/task/update", data)
            toast.success("Routine updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ updatingAllTask: false })
        }
    },

    deleteSingleTask: async (taskId) => {
        set({ deletingSingleTask: true })
        const prevTasks = get().tasks
        const prevHistory = get().history
        set((state) => ({
            tasks: state.tasks.filter(t => (t?.taskId ?? t?.id ?? t) !== taskId),
            history: state.history.filter(t => (t?.taskId ?? t?.id ?? t) !== taskId),
        }))

        try {
            await axiosInstance.delete(`/task/delete/${taskId}`)
            toast.success("Routine task deleted")
        } catch (error) {
            // rollback to previous state if deletion failed
            set({ tasks: prevTasks, history: prevHistory })
            toast.error(error.response?.data?.message || "Failed to delete routine task")
        }
        finally {
            set({ deletingSingleTask: false })
        }
    },

    deleteRoutine: async () => {
        set({ deletingAllRoutine: true })
        try {
            const res = await axiosInstance.delete("/task/delete")
            toast.success("routine deleted successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ deletingAllRoutine: false })
        }
    },
    
    toggleRoutineForToday: async (taskId) => {
        set({ togglingRoutineForToday: true })
        try {
            const res = await axiosInstance.get(`/task-completion/check/${taskId}`)
            toast.success("task done")
        } catch (error) {
            toast.error(error.response?.data?.message || "An unexpected error occurred")
        }
        finally {
            set({ togglingRoutineForToday: false })
        }
    },
    
    getStatsForGraph: async (taskId) => {
        set({ gettingStatsForGraph: true })
        try {
            const res = await axiosInstance.get(`/task-completion/stats`)
            set({ stats: res.data })
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ gettingStatsForGraph: false })
        }
    },
    
    getHistoryForGraph: async (taskId) => {
        set({ gettingHistory: true })
        try {
            const res = await axiosInstance.get(`/task-completion/history`)
            set({ history: res.data })
        } catch (error) {
            toast.error(error.response?.data?.message || "An unexpected error occurred")
        }
        finally {
            set({ gettingHistory: false })
        }
    },
    
    getDashboardLayout: async () => {
        set({ gettingDashboardLayout: true })
        try {
            const res = await axiosInstance.get("/auth/dashboard/layout")
            
            const normalizeType = (type) => {
                switch (type) {
                    case "CONSISTENCY":
                    case "BREAKDOWN":
                    case "WEEKLY_ACTIVITY":
                    case "ROUTINE_BALANCE":
                    case "TIME_OF_DAY":
                    case "GOAL_PROGRESS":
                    case "EMPTY":
                        return type;
                    default:
                        return "EMPTY";
                }
            };

            set({
                dashboardLayout: [
                    normalizeType(res.data.slot1Type),
                    normalizeType(res.data.slot2Type),
                    normalizeType(res.data.slot3Type),
                    normalizeType(res.data.slot4Type)
                ]
            })
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dashboard layout")
        }
        finally {
            set({ gettingDashboardLayout: false })
        }
    },
    
    saveDashboardLayout: async (newLayout) => {
        set({ savingDashboardLayout: true })
        try {
            const formatType = (type) => {
                switch (type) {
                    case "CONSISTENCY":
                    case "BREAKDOWN":
                    case "WEEKLY_ACTIVITY":
                    case "ROUTINE_BALANCE":
                    case "TIME_OF_DAY":
                    case "GOAL_PROGRESS":
                    case "EMPTY":
                        return type;
                    default:
                        return "EMPTY";
                }
            };
            
            const payload = {
                slot1Type: formatType(newLayout[0]),
                slot2Type: formatType(newLayout[1]),
                slot3Type: formatType(newLayout[2]),
                slot4Type: formatType(newLayout[3])
            }
            
            const res = await axiosInstance.put("/auth/dashboard/layout", payload)
            
            set({
                dashboardLayout: [
                    formatType(res.data.slot1Type),
                    formatType(res.data.slot2Type),
                    formatType(res.data.slot3Type),
                    formatType(res.data.slot4Type)
                ]
            })
            toast.success("Dashboard layout updated")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save dashboard layout")
        }
        finally {
            set({ savingDashboardLayout: false })
        }
    },
    
    setDashboardLayout: (newLayout) => {
        set({ dashboardLayout: newLayout })
    }
}))
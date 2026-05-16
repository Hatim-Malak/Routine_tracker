import { axiosInstance } from "../lib/axios"
import { toast } from "react-hot-toast"
import { create } from "zustand"

const throttle = (fn, wait = 700) => {
    let lastCalled = 0
    return async (...args) => {
        const now = Date.now()
        if (now - lastCalled < wait) {
            return
        }
        lastCalled = now
        return fn(...args)
    }
}

const toggleListCompletion = (list = [], taskId) => {
    let didUpdate = false
    const todayKey = new Date().toISOString().slice(0, 10)

    const updated = list.map((task) => {
        const id = task?.taskId ?? task?.id ?? task
        if (id !== taskId || !Array.isArray(task.weekHistory)) return task

        const weekHistory = task.weekHistory.map((day) => {
            if (!day?.date?.startsWith(todayKey)) return day
            didUpdate = true
            return { ...day, completed: !day.completed }
        })

        return { ...task, weekHistory }
    })

    return { updated, didUpdate }
}

export const useTask = create((set, get) => ({
    tasks: [],
    history: [],
    stats: [],
    dashboardLayout: ["CONSISTENCY", "BREAKDOWN", "EMPTY", "EMPTY"],
    
    // --- CACHE FLAGS ---
    statsCacheValid: false,
    historyCacheValid: false,
    // -------------------

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
            set({ 
                tasks: res.data, 
                statsCacheValid: false,   // Invalidates Cache on CRUD
                historyCacheValid: false 
            })
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
            set({ statsCacheValid: false, historyCacheValid: false }) // Invalidate
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
            set({ statsCacheValid: false, historyCacheValid: false }) // Invalidate
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
            statsCacheValid: false, // Invalidate
            historyCacheValid: false 
        }))

        try {
            await axiosInstance.delete(`/task/delete/${taskId}`)
            toast.success("Routine task deleted")
        } catch (error) {
            set({ tasks: prevTasks, history: prevHistory }) // Rollback
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
            set({ statsCacheValid: false, historyCacheValid: false }) // Invalidate
            toast.success("routine deleted successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ deletingAllRoutine: false })
        }
    },
    
    toggleRoutineForToday: throttle(async (taskId) => {
        const prevHistory = get().history
        const prevTasks = get().tasks

        const { updated: optimisticHistory, didUpdate } = toggleListCompletion(prevHistory, taskId)
        const { updated: optimisticTasks } = toggleListCompletion(prevTasks, taskId)

        if (didUpdate) {
            set({ history: optimisticHistory, tasks: optimisticTasks })
        }

        // We invalidate the cache BEFORE the call so that if the user flips tabs 
        // while the request is pending, it guarantees a fresh fetch.
        set({ togglingRoutineForToday: true, statsCacheValid: false, historyCacheValid: false })
        
        try {
            await axiosInstance.get(`/task-completion/check/${taskId}`)
            toast.success("Routine updated")
        } catch (error) {
            set({ history: prevHistory, tasks: prevTasks }) // Rollback on failure
            toast.error(error.response?.data?.message || "Failed to update routine completion")
        } finally {
            set({ togglingRoutineForToday: false })
        }
    }),
    
    getStatsForGraph: async (forceRefetch = false) => {
        const { statsCacheValid, stats } = get()
        
        // 🚀 FRONTEND CACHING: If cache is valid and we have data, abort the API call!
        if (!forceRefetch && statsCacheValid && Object.keys(stats).length > 0) {
            return;
        }

        set({ gettingStatsForGraph: true })
        try {
            const res = await axiosInstance.get(`/task-completion/stats`)
            set({ stats: res.data, statsCacheValid: true }) // Mark cache as valid
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ gettingStatsForGraph: false })
        }
    },
    
    getHistoryForGraph: async (forceRefetch = false) => {
        const { historyCacheValid, history } = get()
        
        // 🚀 FRONTEND CACHING: If cache is valid, serve from Zustand memory!
        if (!forceRefetch && historyCacheValid && history.length > 0) {
            return;
        }

        set({ gettingHistory: true })
        try {
            const res = await axiosInstance.get(`/task-completion/history`)
            set({ history: res.data, historyCacheValid: true }) // Mark cache as valid
        } catch (error) {
            toast.error(error.response?.data?.message || "An unexpected error occurred")
        }
        finally {
            set({ gettingHistory: false })
        }
    },
    
    // Layout functions remain unchanged...
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
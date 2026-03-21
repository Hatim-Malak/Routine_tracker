import { axiosInstance } from "../lib/axios"
import {toast} from "react-hot-toast"
import {create} from "zustand"

export const useTask = create((set,get)=>({
    tasks:[],
    history:[],
    stats:[],
    gettingStatsForGraph:false,
    creatingTask:false,
    deletingSingleTask:false,
    gettingHistory:false,
    deletingAllRoutine:false,
    updatingSingleTask:false,
    updatingAllTask:false,
    togglingRoutineForToday:false,
    

    createTask:async(data)=>{
        set({creatingTask:true})
        try {
            const res = await axiosInstance.post("/task/create-task",data)
            set({tasks:res.data})
            toast.success("Routine Created Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({creatingTask:false})
        }
    },
    updateSingleTask:async(data,taskId)=>{
        set({updatingSingleTask:true})
        try {
            const res = await axiosInstance.put(`/task/update/${taskId}`,data)
            toast.success("Routine task updated successfully")
        } catch (error) {
           toast.error(error.response.data.message) 
        }
        finally{
            set({updateSingleTask:false})
        }
    },

    updateAllandresettask:async(data)=>{
        set({updatingAllTask:true})
        try {
            const res = await axiosInstance.put("/task/update",data)
            toast.success("Routine updated successfully")
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({updatingAllTask:false})
        }
    },

    deleteSingleTask:async(taskId)=>{
        set({deleteSingleTask:true})
        try {
            const res = await axiosInstance.delete(`/task/delete/${taskId}`)
            toast.success("Routine task deleted")
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({deleteSingleTask:false})
        }
    },
    
    deleteRoutine:async()=>{
        set({deletingAllRoutine:true})
        try {
            const res = await axiosInstance.delete("/task/delete")
            toast.success("routine deleted successfully")
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({deletingAllRoutine:false})
        }
    },
    toggleRoutineForToday:async(taskId)=>{
        set({toggleRoutineForToday:true})
        try {
            const res = await axiosInstance.get(`/task-completion/check/${taskId}`)
            toast.success("task done")
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({toggleRoutineForToday:false})
        }
    },
    getStatsForGraph:async(taskId)=>{
        set({gettingStatsForGraph:true})
        try {
            const res = await axiosInstance.get(`/task-completion/stats`)
            set({stats:res.data})
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({gettingStatsForGraph:false})
        }
    },
    getHistoryForGraph:async(taskId)=>{
        set({gettingHistory:true})
        try {
            const res = await axiosInstance.get(`/task-completion/history`)
            set({history:res.data})
        } catch (error) {
            toast.error(error.response.data.message) 
        }
        finally{
            set({gettingHistory:false})
        }
    }
}))
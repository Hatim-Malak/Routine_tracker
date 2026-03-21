package Task_Tracker.Backend.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Task_Tracker.Backend.DTO.TaskRequest;
import Task_Tracker.Backend.models.Task;
import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.repository.TaskRepo;
import jakarta.transaction.Transactional;

@Service
public class TaskService {

    @Autowired
    private TaskRepo taskRepo;

    public List<Task> createTask(List<TaskRequest> taskRequest,User user) throws Exception{
        List<Task> newTask = new ArrayList<>();
        for(TaskRequest oldTask:taskRequest){
            Task task = new Task();
            task.setTitle(oldTask.getTitle());
            task.setStartTime(oldTask.getStartTime());
            task.setEndTime(oldTask.getEndTime());
            task.setUser(user);

            newTask.add(task);
        }

        return taskRepo.saveAll(newTask);
    }

    public String deleteSingleTask(Integer taskId,User user) throws Exception{
        Task task = taskRepo.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));
        taskRepo.delete(task);
        return "task deleted successfully";
    }

    @Transactional
    public String clearEntireRoutine(User user) throws Exception{
        taskRepo.deleteAllByUser(user);
        return "All task deleted successfully";
    }

    @Transactional
    public List<Task> resetRoutine(List<TaskRequest> tasks,User user) throws Exception{
        taskRepo.deleteAllByUser(user);
        return createTask(tasks, user);
    }

    public Task updateSinglrTask(Integer taskId,TaskRequest request,User user) throws Exception{
        Task task = taskRepo.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or unauthorized"));
                
        task.setTitle(request.getTitle());
        task.setStartTime(request.getStartTime());
        task.setEndTime(request.getEndTime());
        
        return taskRepo.save(task);
    }
}

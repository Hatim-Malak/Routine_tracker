package Task_Tracker.Backend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import Task_Tracker.Backend.DTO.TaskRequest;
import Task_Tracker.Backend.models.Task;
import Task_Tracker.Backend.services.TaskService;
import Task_Tracker.Backend.services.UserPrincipal;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/create-task")
    public ResponseEntity<List<Task>> createTask(@RequestBody List<TaskRequest> request,Authentication authentication){
        try {
            if(request == null || request.isEmpty()){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            List<Task> tasks = taskService.createTask(request,userPrincipal.getUser());
            return new ResponseEntity<>(tasks,HttpStatus.OK); 
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<String> deleteSingleTask(@PathVariable Integer taskId,Authentication authentication){
        try {
            if(taskId == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String deleteMessage = taskService.deleteSingleTask(taskId, userPrincipal.getUser());
            return new ResponseEntity<>(deleteMessage,HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal server error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> clearEntireRoutine(Authentication authentication){
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String deleteMessage = taskService.clearEntireRoutine(userPrincipal.getUser());
            return new ResponseEntity<>(deleteMessage,HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<List<Task>> resetRoutine(@RequestBody List<TaskRequest> tasks,Authentication authentication){
        try {
            if(tasks == null || tasks.isEmpty()){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            List<Task> listTask = taskService.resetRoutine(tasks, userPrincipal.getUser());
            return new ResponseEntity<>(listTask,HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{taskId}")
    public ResponseEntity<Task> updateSinglrTask(@PathVariable Integer taskId,@RequestBody TaskRequest request,Authentication authentication){
        try {
            if(taskId == null){
                System.out.println("taskId is null");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(request == null || request.getTitle() == null || request.getStartTime() == null || request.getEndTime() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Task task = taskService.updateSinglrTask(taskId, request, userPrincipal.getUser());
            return new ResponseEntity<>(task,HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

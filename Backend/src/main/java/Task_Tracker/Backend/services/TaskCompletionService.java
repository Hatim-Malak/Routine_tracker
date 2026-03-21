package Task_Tracker.Backend.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Task_Tracker.Backend.models.Task;
import Task_Tracker.Backend.models.TaskCompletion;
import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.repository.TaskCompletionRepo;
import Task_Tracker.Backend.repository.TaskRepo;
import java.util.stream.Collectors;
import Task_Tracker.Backend.DTO.DashBoardStatsResponse;
import Task_Tracker.Backend.DTO.RoutineWithHistoryResponse;
import Task_Tracker.Backend.DTO.RoutineWithHistoryResponse.DailyStatus;

@Service
public class TaskCompletionService {
    @Autowired
    private TaskCompletionRepo taskCompletionRepo;

    @Autowired
    private TaskRepo taskRepo;

    public String toggleRoutineForToday(Integer routineId,User user) throws Exception{
        Task routine = taskRepo.findByIdAndUser(routineId, user)
            .orElseThrow(()->new RuntimeException("Routine not found or unauthorized"));
        
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Optional<TaskCompletion> existingCompletion = taskCompletionRepo.findByTaskAndCompletionDate(routine, today);

        if(existingCompletion.isPresent()){
            taskCompletionRepo.delete(existingCompletion.get());
            return "Routine unchecked for today";
        }
        else{
            if(routine.getStartTime() != null && routine.getEndTime() != null){
                if(now.isBefore(routine.getStartTime()) || now.isAfter(routine.getEndTime())){
                    throw new RuntimeException("Outside of the allowed time window for this routine!");
                }
            }
        }

        TaskCompletion newCompletion = new TaskCompletion();
        newCompletion.setTask(routine);
        newCompletion.setCompletedAt(LocalTime.now());
        newCompletion.setCompletionDate(today);

        taskCompletionRepo.save(newCompletion);
        return "Routine is Successfully completed for today";
    }

    public DashBoardStatsResponse getDashboardStats(User user) {

        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<TaskCompletion> recentCompletions = taskCompletionRepo.findAllUserCompletionsFromDate(user.getId(), thirtyDaysAgo);


        List<DashBoardStatsResponse.DailyActivity> consistencyData = recentCompletions.stream()
            .collect(Collectors.groupingBy(tc -> tc.getCompletionDate().toString(), Collectors.counting()))
            .entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.DailyActivity(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());


        List<DashBoardStatsResponse.RoutinePopularity> breakdownData = recentCompletions.stream()

            .collect(Collectors.groupingBy(tc -> tc.getTask().getTitle(), Collectors.counting())) 
            .entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.RoutinePopularity(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());


        List<String> activeDates = recentCompletions.stream()
            .map(tc -> tc.getCompletionDate().toString())
            .distinct() 
            .collect(Collectors.toList());


        return new DashBoardStatsResponse(consistencyData, breakdownData, activeDates);
    }

    public List<RoutineWithHistoryResponse> getRoutineWithWeekHistory(User user){
        List<Task> routines = taskRepo.findByUser(user);

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);

        List<TaskCompletion> recentCompletion = taskCompletionRepo.findAllUserCompletionsFromDate(user.getId(), sevenDaysAgo);

        List<LocalDate> last7Dates = new ArrayList<>();
        for(int i =6;i>=0;i--){
            last7Dates.add(today.minusDays(i));
        }

        List<RoutineWithHistoryResponse> responseList = new ArrayList<>();

        for(Task routine:routines){
            List<DailyStatus> history = new ArrayList<>();
            for(LocalDate date:last7Dates){
                boolean isCompleted = recentCompletion.stream()
                    .anyMatch(tc -> tc.getTask().getId().equals(routine.getId()) && tc.getCompletionDate().equals(date));
                history.add(new DailyStatus(date.toString(), isCompleted));
            }
            responseList.add(new RoutineWithHistoryResponse(routine.getId(), routine.getTitle(), routine.getStartTime(), routine.getEndTime(), history));
        }
        return responseList;
    }
}

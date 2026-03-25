package Task_Tracker.Backend.services;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.slf4j.LoggerFactory;
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

    @Autowired
    private CacheService cacheService;

    private static final org.slf4j.Logger log =  LoggerFactory.getLogger(TaskCompletionService.class);

    private static final String DASHBOARD_CACHE_PREFIX = "sashboardStats:userId:";
    private static final String HISTORY_CACHE_PREFIX = "routinerId:userId:";

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

        TaskCompletion newCompletion = new TaskCompletion();
        newCompletion.setTask(routine);
        newCompletion.setCompletedAt(LocalTime.now());
        newCompletion.setCompletionDate(today);

        taskCompletionRepo.save(newCompletion);

        invalidateUserCache(user.getId());
        return "Routine is Successfully completed for today";
    }

    public DashBoardStatsResponse getDashboardStats(User user) {

        String cacheKey = DASHBOARD_CACHE_PREFIX + user.getId();

        try {
            DashBoardStatsResponse cacheStats = cacheService.get(cacheKey, DashBoardStatsResponse.class);
            if(cacheStats != null){
                return cacheStats;
            }
        } catch (Exception e) {
            log.warn("Re3dis error on fetching Dashboard ststs, falling back to db",e);
        }

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
        
        DashBoardStatsResponse response = new DashBoardStatsResponse(consistencyData, breakdownData, activeDates);

            try {
                cacheService.set(cacheKey, response, Duration.ofHours(2));
            } catch (Exception e) {
                log.error("failed to cache dashboard stats",e);
            }

        return response;
    }

    public List<RoutineWithHistoryResponse> getRoutineWithWeekHistory(User user){
        String cacheKey = HISTORY_CACHE_PREFIX + user.getId();

        try {
            RoutineWithHistoryResponse[] cachedArray = cacheService.get(cacheKey, RoutineWithHistoryResponse[].class);
            if(cachedArray != null){
                return Arrays.asList(cachedArray);
            }
        } catch (Exception e) {
            log.warn("Redis error on fetching routine history, failling back to DB",e);
        }

        List<Task> routines = taskRepo.findByUser(user);

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(29);

        List<TaskCompletion> recentCompletion = taskCompletionRepo.findAllUserCompletionsFromDate(user.getId(), thirtyDaysAgo);

        List<LocalDate> last30Dates = new ArrayList<>();
        for(int i =29;i>=0;i--){
            last30Dates.add(today.minusDays(i));
        }

        List<RoutineWithHistoryResponse> responseList = new ArrayList<>();

        for(Task routine:routines){
            List<DailyStatus> history = new ArrayList<>();
            for(LocalDate date:last30Dates){
                boolean isCompleted = recentCompletion.stream()
                    .anyMatch(tc -> tc.getTask().getId().equals(routine.getId()) && tc.getCompletionDate().equals(date));
                history.add(new DailyStatus(date.toString(), isCompleted));
            }
            responseList.add(new RoutineWithHistoryResponse(routine.getId(), routine.getTitle(), routine.getStartTime(), routine.getEndTime(), history));
        }

        try {
            cacheService.set(cacheKey, responseList.toArray(new RoutineWithHistoryResponse[0]), Duration.ofHours(2));
        } catch (Exception e) {
            log.error("Failed to cache routine history", e);
        }

        return responseList;
    }

    private void invalidateUserCache(Integer userId) {
        try {
            cacheService.delete(DASHBOARD_CACHE_PREFIX + userId);
            cacheService.delete(HISTORY_CACHE_PREFIX + userId);
        } catch (Exception e) {
            log.error("Failed to invalidate cache for user: " + userId, e);
        }
    }
}

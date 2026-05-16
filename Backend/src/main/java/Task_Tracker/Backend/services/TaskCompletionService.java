package Task_Tracker.Backend.services;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

    private static final String DASHBOARD_CACHE_PREFIX = "dashboardStats:userId:";
    private static final String HISTORY_CACHE_PREFIX = "routinerId:userId:";

    public String toggleRoutineForToday(Integer routineId,User user) throws Exception{
        Task routine = taskRepo.findByIdAndUser(routineId, user)
            .orElseThrow(()->new RuntimeException("Routine not found or unauthorized"));
        
        LocalDate today = LocalDate.now();
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
            if (cacheStats != null) {
                return cacheStats;
            }
        } catch (Exception e) {
            log.warn("Redis error on fetching Dashboard stats, falling back to db", e);
        }

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(30);
        List<TaskCompletion> recentCompletions = taskCompletionRepo.findAllUserCompletionsFromDate(user.getId(), thirtyDaysAgo);

        // 1. Consistency Data
        List<DashBoardStatsResponse.DailyActivity> consistencyData = recentCompletions.stream()
            .collect(Collectors.groupingBy(tc -> tc.getCompletionDate().toString(), Collectors.counting()))
            .entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.DailyActivity(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 2. Breakdown Data
        List<DashBoardStatsResponse.RoutinePopularity> breakdownData = recentCompletions.stream()
            .collect(Collectors.groupingBy(tc -> tc.getTask().getTitle(), Collectors.counting())) 
            .entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.RoutinePopularity(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 3. Active Dates
        List<String> activeDates = recentCompletions.stream()
            .map(tc -> tc.getCompletionDate().toString())
            .distinct() 
            .collect(Collectors.toList());

        // --- FIXED CHART CALCULATIONS ---

        // 4. Weekly Activity (Pre-filled to ensure empty days render nicely with a 0 value)
        LocalDate sevenDaysAgo = today.minusDays(7);
        Map<String, Integer> weeklyMap = new LinkedHashMap<>();
        weeklyMap.put("Mon", 0);
        weeklyMap.put("Tue", 0);
        weeklyMap.put("Wed", 0);
        weeklyMap.put("Thu", 0);
        weeklyMap.put("Fri", 0);
        weeklyMap.put("Sat", 0);
        weeklyMap.put("Sun", 0);

        recentCompletions.stream()
            .filter(tc -> !tc.getCompletionDate().isBefore(sevenDaysAgo))
            .forEach(tc -> {
                String dayName = tc.getCompletionDate().getDayOfWeek()
                    .getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);
                if (weeklyMap.containsKey(dayName)) {
                    weeklyMap.put(dayName, weeklyMap.get(dayName) + 1);
                }
            });

        List<DashBoardStatsResponse.WeeklyData> weeklyData = weeklyMap.entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.WeeklyData(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 5. Goal Progress (Calculated against a target of 15 completions/week)
        long completionsThisWeek = recentCompletions.stream()
            .filter(tc -> !tc.getCompletionDate().isBefore(sevenDaysAgo))
            .count();
        
        int goalTarget = 15; 
        int progressPercentage = (int) Math.min((completionsThisWeek * 100) / goalTarget, 100); 
        
        List<DashBoardStatsResponse.GoalProgressData> goalData = List.of(
            new DashBoardStatsResponse.GoalProgressData("Weekly Goal", progressPercentage)
        );

        // --- CREATE RESPONSE ---
        DashBoardStatsResponse response = new DashBoardStatsResponse();

        response.setConsistencyGraph(consistencyData);
        response.setBreakdownGraph(breakdownData);
        response.setActiveDatesForHeatmap(activeDates);
        response.setWeeklyGraph(weeklyData);
        response.setGoalProgressGraph(goalData);

        // 6. Balance Data (Using user categories mapped on Task creations)
        List<DashBoardStatsResponse.BalanceData> balanceData = recentCompletions.stream()
            .filter(tc -> tc.getTask().getCategory() != null)
            .collect(Collectors.groupingBy(
                tc -> tc.getTask().getCategory(), 
                Collectors.counting()
            ))
            .entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.BalanceData(entry.getKey(), entry.getValue().intValue()))
            .collect(Collectors.toList());

        response.setBalanceGraph(balanceData);

        // 7. Time of Day (FIXED: Uses actual interaction timestamp instead of target time configuration)
        Map<String, Integer> timeBlocks = new LinkedHashMap<>();
        timeBlocks.put("Morning (6 AM-12 PM)", 0);
        timeBlocks.put("Afternoon (12 PM-6 PM)", 0);
        timeBlocks.put("Evening (6 PM-12 AM)", 0);
        timeBlocks.put("Night (12 AM-6 AM)", 0);

        for (TaskCompletion tc : recentCompletions) {
            LocalTime completionTime = tc.getCompletedAt(); 
            
            if (completionTime != null) {
                int hour = completionTime.getHour();

                if (hour >= 6 && hour < 12) {
                    timeBlocks.put("Morning (6 AM-12 PM)", timeBlocks.get("Morning (6 AM-12 PM)") + 1);
                } else if (hour >= 12 && hour < 18) {
                    timeBlocks.put("Afternoon (12 PM-6 PM)", timeBlocks.get("Afternoon (12 PM-6 PM)") + 1);
                } else if (hour >= 18 && hour < 24) {
                    timeBlocks.put("Evening (6 PM-12 AM)", timeBlocks.get("Evening (6 PM-12 AM)") + 1);
                } else {
                    timeBlocks.put("Night (12 AM-6 AM)", timeBlocks.get("Night (12 AM-6 AM)") + 1);
                }
            }
        }

        List<DashBoardStatsResponse.TimeOfDayData> timeOfDayData = timeBlocks.entrySet().stream()
            .map(entry -> new DashBoardStatsResponse.TimeOfDayData(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        response.setTimeOfDayGraph(timeOfDayData);      

        try {
            cacheService.set(cacheKey, response, Duration.ofHours(2));
        } catch (Exception e) {
            log.error("Failed to cache dashboard stats", e);
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

    public void invalidateUserCache(Integer userId) {
        try {
            cacheService.delete(DASHBOARD_CACHE_PREFIX + userId);
            cacheService.delete(HISTORY_CACHE_PREFIX + userId);
        } catch (Exception e) {
            log.error("Failed to invalidate cache for user: " + userId, e);
        }
    }
}

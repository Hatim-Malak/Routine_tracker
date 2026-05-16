package Task_Tracker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashBoardStatsResponse {
    
    // Existing fields
    private List<DailyActivity> consistencyGraph; 
    private List<RoutinePopularity> breakdownGraph; 
    private List<String> activeDatesForHeatmap; 

    // --- NEW FIELDS FOR THE 6-CHART DASHBOARD ---
    private List<WeeklyData> weeklyGraph = new ArrayList<>();
    private List<BalanceData> balanceGraph = new ArrayList<>();
    private List<TimeOfDayData> timeOfDayGraph = new ArrayList<>();
    private List<GoalProgressData> goalProgressGraph = new ArrayList<>();

    // --- EXISTING INNER CLASSES ---
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyActivity {
        private String date; 
        private long totalCompleted; 
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoutinePopularity {
        private String routineName; 
        private long completionCount; 
    }

    // --- NEW INNER CLASSES ---
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WeeklyData {
        private String day;
        private int count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BalanceData {
        private String category;
        private int score;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TimeOfDayData {
        private String time;
        private int completed;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GoalProgressData {
        private String name;
        private int value;
    }
}
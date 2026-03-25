package Task_Tracker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashBoardStatsResponse {
    private List<DailyActivity> consistencyGraph; 
    private List<RoutinePopularity> breakdownGraph; 
    private List<String> activeDatesForHeatmap; 

    @Data
    @AllArgsConstructor
    @NoArgsConstructor // <-- ADD THIS
    public static class DailyActivity {
        private String date; 
        private long totalCompleted; 
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor // <-- ADD THIS
    public static class RoutinePopularity {
        private String routineName; 
        private long completionCount; 
    }
}
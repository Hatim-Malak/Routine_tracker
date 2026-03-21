package Task_Tracker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class DashBoardStatsResponse {
    private List<DailyActivity> consistencyGraph; 
    private List<RoutinePopularity> breakdownGraph; 
    private List<String> activeDatesForHeatmap; 

    @Data
    @AllArgsConstructor
    public static class DailyActivity {
        private String date; 
        private long totalCompleted; 
    }

    @Data
    @AllArgsConstructor
    public static class RoutinePopularity {
        private String routineName; 
        private long completionCount; 
    }
}
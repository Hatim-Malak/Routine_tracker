package Task_Tracker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
public class RoutineWithHistoryResponse {
    private Integer taskId;
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
    
    private List<DailyStatus> weekHistory; 

    @Data
    @AllArgsConstructor
    public static class DailyStatus {
        private String date;       
        private boolean completed; 
    }
}
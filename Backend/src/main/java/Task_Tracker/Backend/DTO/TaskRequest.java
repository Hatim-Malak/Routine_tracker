package Task_Tracker.Backend.DTO;

import java.time.LocalTime;

import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private LocalTime startTime;
    private LocalTime endTime;
}

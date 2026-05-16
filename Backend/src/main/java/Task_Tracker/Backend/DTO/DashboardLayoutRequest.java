package Task_Tracker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardLayoutRequest {
    private String slot1Type;
    private String slot2Type;
    private String slot3Type;
    private String slot4Type;
}

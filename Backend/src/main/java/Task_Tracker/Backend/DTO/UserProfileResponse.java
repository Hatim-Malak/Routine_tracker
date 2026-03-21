package Task_Tracker.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Integer id;
    private String username;
    private String email;
}
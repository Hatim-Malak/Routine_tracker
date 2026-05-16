package Task_Tracker.Backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dashboard_layouts")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DashboardLayout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String slot1Type; // CONSISTENCY, BREAKDOWN, HISTORY, EMPTY
    private String slot2Type;
    private String slot3Type;
    private String slot4Type;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

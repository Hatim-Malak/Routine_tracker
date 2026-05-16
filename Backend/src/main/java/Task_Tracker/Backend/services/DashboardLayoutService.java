package Task_Tracker.Backend.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Task_Tracker.Backend.DTO.DashboardLayoutRequest;
import Task_Tracker.Backend.models.DashboardLayout;
import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.repository.DashboardLayoutRepository;

@Service
public class DashboardLayoutService {
    @Autowired
    private DashboardLayoutRepository dashboardLayoutRepository;

    public DashboardLayout getOrCreateDefaultLayout(User user) {
        Optional<DashboardLayout> existing = dashboardLayoutRepository.findByUser(user);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        // Create default layout: CONSISTENCY, BREAKDOWN, EMPTY, EMPTY
        DashboardLayout layout = new DashboardLayout();
        layout.setUser(user);
        layout.setSlot1Type("CONSISTENCY");
        layout.setSlot2Type("BREAKDOWN");
        layout.setSlot3Type("EMPTY");
        layout.setSlot4Type("EMPTY");
        layout.setCreatedAt(LocalDateTime.now());
        layout.setUpdatedAt(LocalDateTime.now());
        
        return dashboardLayoutRepository.save(layout);
    }

    public DashboardLayout updateLayout(User user, DashboardLayoutRequest request) {
        Optional<DashboardLayout> existing = dashboardLayoutRepository.findByUser(user);
        
        DashboardLayout layout = existing.orElseGet(() -> {
            DashboardLayout newLayout = new DashboardLayout();
            newLayout.setUser(user);
            newLayout.setCreatedAt(LocalDateTime.now());
            return newLayout;
        });

        layout.setSlot1Type(sanitizeWidgetType(request.getSlot1Type()));
        layout.setSlot2Type(sanitizeWidgetType(request.getSlot2Type()));
        layout.setSlot3Type(sanitizeWidgetType(request.getSlot3Type()));
        layout.setSlot4Type(sanitizeWidgetType(request.getSlot4Type()));
        layout.setUpdatedAt(LocalDateTime.now());

        return dashboardLayoutRepository.save(layout);
    }

    private String sanitizeWidgetType(String type) {
        if (type == null) return "EMPTY";
        switch (type) {
            case "CONSISTENCY":
            case "BREAKDOWN":
            case "EMPTY":
                return type;
            default:
                return "EMPTY";
        }
    }

    public DashboardLayout getLayoutByUser(User user) {
        return getOrCreateDefaultLayout(user);
    }
}

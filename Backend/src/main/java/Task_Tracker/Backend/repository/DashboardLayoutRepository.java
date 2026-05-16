package Task_Tracker.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Task_Tracker.Backend.models.DashboardLayout;
import Task_Tracker.Backend.models.User;

@Repository
public interface DashboardLayoutRepository extends JpaRepository<DashboardLayout, Integer> {
    Optional<DashboardLayout> findByUser(User user);
}

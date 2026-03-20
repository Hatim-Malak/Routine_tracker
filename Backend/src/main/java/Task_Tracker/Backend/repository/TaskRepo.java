package Task_Tracker.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import Task_Tracker.Backend.models.Task;
import Task_Tracker.Backend.models.User;
import java.util.Optional;

public interface TaskRepo extends JpaRepository<Task,Integer> {
    List<Task> findByUser(User user);
    Optional<Task> findByIdAndUser(Integer id, User user);
    void deleteAllByUser(User user);
}

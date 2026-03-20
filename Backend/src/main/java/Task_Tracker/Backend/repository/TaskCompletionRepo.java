package Task_Tracker.Backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Task_Tracker.Backend.models.TaskCompletion;

public interface TaskCompletionRepo extends JpaRepository<TaskCompletion,Integer> {
    @Query("SELECT tc FROM TaskCompletion tc WHERE tc.task.user.id = :userId " +
           "AND tc.completionDate >= :startDate")
    List<TaskCompletion> findRecentCompletions(Integer userId, LocalDate startDate);
}

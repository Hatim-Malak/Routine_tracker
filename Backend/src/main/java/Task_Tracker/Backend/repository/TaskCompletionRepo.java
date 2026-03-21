package Task_Tracker.Backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import Task_Tracker.Backend.models.Task;
import Task_Tracker.Backend.models.TaskCompletion;


public interface TaskCompletionRepo extends JpaRepository<TaskCompletion,Integer> {
    Optional<TaskCompletion> findByTaskAndCompletionDate(Task task, LocalDate date);
    List<TaskCompletion> findAllByTaskOrderByCompletionDateDesc(Task task);
    @Query("SELECT tc FROM TaskCompletion tc WHERE tc.task.user.id = :userId AND tc.completionDate >= :startDate")
    List<TaskCompletion> findAllUserCompletionsFromDate(
        @Param("userId") Integer userId, 
        @Param("startDate") LocalDate startDate
    );
}

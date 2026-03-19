package Task_Tracker.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Task_Tracker.Backend.models.User;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {
    User findByEmail(String Username);
}

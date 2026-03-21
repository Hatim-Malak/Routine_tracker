package Task_Tracker.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Task_Tracker.Backend.models.BlacklistedToken;

@Repository
public interface BlacklistedTokenRepo extends JpaRepository<BlacklistedToken,Integer> {
    boolean existsByToken(String token);
}

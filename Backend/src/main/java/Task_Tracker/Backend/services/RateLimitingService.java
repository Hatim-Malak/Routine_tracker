package Task_Tracker.Backend.services;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

@Service
public class RateLimitingService {
    private final Map<String,Bucket> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String ipSddress){
        return cache.computeIfAbsent(ipSddress, this::newBucket);
    }
    
    private Bucket newBucket(String ipAddress){
        Bandwidth limit = Bandwidth.classic(20,Refill.greedy(20, Duration.ofMinutes(1)));
        return Bucket.builder()
        .addLimit(limit)
        .build();
    }
}
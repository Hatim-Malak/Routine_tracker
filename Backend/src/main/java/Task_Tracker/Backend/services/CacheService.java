package Task_Tracker.Backend.services;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class CacheService {
    @Autowired
    private RedisTemplate<String,Object> redisTemplate;

    public <T> T get(String key,Class<T> clazz){
        Object value = redisTemplate.opsForValue().get(key);
        return value != null ? clazz.cast(value):null;
    }

    public void set(String key,Object value,Duration ttl){
        redisTemplate.opsForValue().set(key,value,ttl);
    }

    public void delete(String key){
        redisTemplate.delete(key);
    }

    public boolean setIfAbsent(String key, Object value, Duration ttl) {
        Boolean result = redisTemplate.opsForValue().setIfAbsent(key, value, ttl);
        return Boolean.TRUE.equals(result);
    }
}

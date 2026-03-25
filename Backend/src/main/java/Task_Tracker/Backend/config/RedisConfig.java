package Task_Tracker.Backend.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 1. Create a custom ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();
        
        // 2. Register the JavaTimeModule to handle LocalDate and LocalTime
        objectMapper.registerModule(new JavaTimeModule());
        
        // 3. Ensure Redis remembers the class types (Prevents ClassCastExceptions)
        objectMapper.activateDefaultTyping(
            objectMapper.getPolymorphicTypeValidator(),
            ObjectMapper.DefaultTyping.NON_FINAL,
            JsonTypeInfo.As.PROPERTY
        );

        // 4. Pass our custom ObjectMapper to the serializer
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer); // Use the custom serializer here
        
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer); // And here

        template.afterPropertiesSet();
        return template;
    }
}
package Task_Tracker.Backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import Task_Tracker.Backend.Interceptors.RateLimitingInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private RateLimitingInterceptor rateLimitingInterceptor;
    
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(rateLimitingInterceptor)
        .addPathPatterns("/api/**");
    }
}

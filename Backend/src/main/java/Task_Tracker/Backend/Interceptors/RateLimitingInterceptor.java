package Task_Tracker.Backend.Interceptors;


import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import Task_Tracker.Backend.services.RateLimitingService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RateLimitingInterceptor implements HandlerInterceptor {
    
    @Autowired
    private RateLimitingService rateLimitingService;

    @Override
    public boolean preHandle(HttpServletRequest request,HttpServletResponse response,Object handler) throws IOException{
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        
        String ipAddress = request.getRemoteAddr();

        Bucket bucket = rateLimitingService.resolveBucket(ipAddress);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if(probe.isConsumed()){
            response.addHeader("x-Rate-Limiting-Remaing",String.valueOf(probe.getRemainingTokens()));
            return true;
        }
        else{
            long waitForRefill = probe.getNanosToWaitForRefill()/1_000_000_000;
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            response.getWriter().write("{\"message\": \"You have exhausted your API Request Quota. Please wait a moment.\"}");
            
            return false;        
        }
    }
}

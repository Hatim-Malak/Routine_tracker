package Task_Tracker.Backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import Task_Tracker.Backend.models.BlacklistedToken;
import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.repository.BlacklistedTokenRepo;
import Task_Tracker.Backend.repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    @Autowired
    private JwtService jwt;

    @Autowired
    private AuthenticationManager authManger;

    @Autowired
    private BlacklistedTokenRepo blacklistedTokenRepo;

    public User register(User user) throws Exception{
        return repo.save(user);
    }

    public String verify(String email,String password) throws Exception{
        Authentication authentication = authManger.authenticate(
            new UsernamePasswordAuthenticationToken(email,password)
        );
        if(authentication.isAuthenticated()){
            return jwt.generateToken(email);
        }
        return "fail";
    }

    public String logout(HttpServletRequest request) throws Exception{
        String authHeader = request.getHeader("Authorization");
        if(authHeader !=null && authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);

            BlacklistedToken blacklistedToken = new BlacklistedToken();
            blacklistedToken.setToken(token);
            blacklistedTokenRepo.save(blacklistedToken);

            SecurityContextHolder.clearContext();

            return "Successfully logout and the token has been blacklisted";
        }
        return "No token found in request";
    }
}

package Task_Tracker.Backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.repository.UserRepo;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    @Autowired
    private JwtService jwt;

    @Autowired
    private AuthenticationManager authManger;

    public User register(User user){
        return repo.save(user);
    }

    public String verify(String email,String password){
        Authentication authentication = authManger.authenticate(
            new UsernamePasswordAuthenticationToken(email,password)
        );
        if(authentication.isAuthenticated()){
            return jwt.generateToken(email);
        }
        return "fail";
    }
}

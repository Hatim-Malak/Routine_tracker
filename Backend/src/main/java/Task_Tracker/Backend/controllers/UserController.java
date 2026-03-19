package Task_Tracker.Backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Task_Tracker.Backend.DTO.LoginRequest;
import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.services.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService service;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @PostMapping("/register")
    public User register(@RequestBody User user){
        String encodedPassword = encoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest){
        return service.verify(loginRequest.getEmail(), loginRequest.getPassword());
    }
}

package Task_Tracker.Backend.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Task_Tracker.Backend.DTO.LoginRequest;
import Task_Tracker.Backend.models.User;
import Task_Tracker.Backend.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserService service;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user){
        try {   
            if(user == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(user.getEmail() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(user.getUsername() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(user.getPassword() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            String encodedPassword = encoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            return new ResponseEntity<>(service.register(user),HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        try {
            if(loginRequest == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(loginRequest.getEmail() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(loginRequest.getPassword() == null){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(service.verify(loginRequest.getEmail(), loginRequest.getPassword()),HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request){
        try {
            return new ResponseEntity<>(service.logout(request),HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("Internal serber error"+e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

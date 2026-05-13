package com.example.user_service.controller;



import com.example.user_service.config.JwtUtil;
import com.example.user_service.dto.AuthRequest;
import com.example.user_service.dto.AuthResponse;
import com.example.user_service.model.User;
import com.example.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserService service;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody AuthRequest req) {
        return service.register(req.getUsername(), req.getPassword());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        User user = service.login(req.getUsername(), req.getPassword());

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole().name());
    }

    @GetMapping("/users")
    public List<User> getAll() {
        return service.getAll();
    }
}
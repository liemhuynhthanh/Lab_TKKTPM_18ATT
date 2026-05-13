package com.example.user_service.service;

import com.example.user_service.model.Role;
import com.example.user_service.model.User;
import com.example.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    // Tạo admin khi ứng dụng khởi động
    @PostConstruct
    public void initAdmin() {
        if (!repo.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password("admin123")
                    .role(Role.ADMIN)
                    .build();
            repo.save(admin);
            System.out.println("Admin created: admin/admin123");
        }
    }

    public User register(String username, String password) {
        if (repo.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(username)
                .password(password)
                .role(Role.USER)
                .build();

        return repo.save(user);
    }

    public User login(String username, String password) {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }

    public List<User> getAll() {
        return repo.findAll();
    }
}
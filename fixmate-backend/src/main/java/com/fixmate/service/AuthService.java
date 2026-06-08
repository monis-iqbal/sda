package com.fixmate.service;

import com.fixmate.dto.LoginRequestDTO;
import com.fixmate.dto.LoginResponseDTO;
import com.fixmate.model.User;
import com.fixmate.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        System.out.println("[AuthService] Email received: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            System.out.println("[AuthService] User NOT FOUND for email: " + request.getEmail());
            return null;
        }

        boolean match = user.getPassword().equals(request.getPassword());

        if (!match) {
            return null;
        }

        return LoginResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}

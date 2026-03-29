package com.urban_events.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urban_events.api.service.UserService;
import com.urban_events.api.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/register")
    public ResponseEntity<String> register(RegisterRequest request) {
        return ResponseEntity.ok(userService.registerUser(request).getEmail() + " registered successfully");
    }
}

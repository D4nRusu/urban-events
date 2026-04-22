package com.urban_events.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urban_events.api.dto.UserResponse;
import com.urban_events.api.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @DeleteMapping("/myaccount")
    public ResponseEntity<String> deleteUserAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.deleteUserByEmail(email);
        return ResponseEntity.ok("User account deleted successfully");
    }

    @GetMapping("/myaccount")
    public ResponseEntity<UserResponse> getMyAccount(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponse response = userService.getMyAccountDetails(authentication.getName());
        return ResponseEntity.ok(response);
    }
}

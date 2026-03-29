package com.urban_events.api.dto;

import com.urban_events.api.model.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String userName;
    private UserRole role; // user / organizer
}
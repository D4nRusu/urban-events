package com.urban_events.api.dto;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private String imageUrl;
    private Set<String> tags;
    private UserResponse organizer; // contains only relevant info
}
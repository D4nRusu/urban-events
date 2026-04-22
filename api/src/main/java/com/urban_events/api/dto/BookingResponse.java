package com.urban_events.api.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private EventResponse event; // Nested event info (including organizer)
    private LocalDateTime bookingDate;
}

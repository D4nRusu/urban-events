package com.urban_events.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urban_events.api.service.BookingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/event/{eventId}")
    public ResponseEntity<String> attend(@PathVariable Long eventId, Authentication auth) {
        bookingService.bookEvent(eventId, auth.getName());
        return ResponseEntity.ok("Successfully registered for the event!");
    }

    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<String> cancel(@PathVariable Long eventId, Authentication auth) {
        bookingService.cancelBooking(eventId, auth.getName());
        return ResponseEntity.ok("Successfully cancelled your booking for the event!"); 
    }
}
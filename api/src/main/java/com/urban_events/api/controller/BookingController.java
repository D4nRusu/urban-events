package com.urban_events.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urban_events.api.dto.BookingResponse;
import com.urban_events.api.model.User;
import com.urban_events.api.service.BookingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping("/mine")
    public ResponseEntity<List<Long>> getMyBookedEventIds(Authentication auth) {
    User user = (User) auth.getPrincipal();
    List<Long> eventIds = bookingService.findAllByUser(user)
                          .stream()
                          .map(b -> b.getEvent().getId())
                          .collect(Collectors.toList());
    return ResponseEntity.ok(eventIds);
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<String> attend(@PathVariable Long eventId, Authentication auth) {
        return ResponseEntity.ok(bookingService.bookEvent(eventId, auth.getName()));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<BookingResponse> bookings = bookingService.findAllByUser(user)
                .stream()
                .map(bookingService::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
}
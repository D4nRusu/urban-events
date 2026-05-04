package com.urban_events.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urban_events.api.service.EventService;
import com.urban_events.api.service.UserService;
import com.urban_events.api.dto.EventResponse;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final UserService userService;

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> adminDeleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id); // Ensure service doesn't check owner if called from here
        return ResponseEntity.noContent().build();
    }
}
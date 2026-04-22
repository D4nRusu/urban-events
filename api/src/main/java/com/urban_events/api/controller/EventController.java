package com.urban_events.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urban_events.api.service.EventService;

import jakarta.validation.Valid;

import com.urban_events.api.dto.CreateEventRequest;
import com.urban_events.api.dto.EventResponse;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody CreateEventRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(eventService.createEvent(request, email));
    }

    @PostMapping("/update/{id}")
    public String updateEvent(@PathVariable Long id) {
        return "This will update the event with ID: " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        return eventService.deleteEvent(id);
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication auth) {
        String email = auth.getName();

        List<EventResponse> myEvents = eventService.getEventsByOrganizer(email);

        return ResponseEntity.ok(myEvents);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id, @Valid @RequestBody CreateEventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }
}

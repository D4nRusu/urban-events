package com.urban_events.api.service;

import org.springframework.stereotype.Service;

import com.urban_events.api.repository.EventRepository;
import com.urban_events.api.repository.UserRepository;

import com.urban_events.api.exceptions.ResourceNotFoundException;
import com.urban_events.api.dto.CreateEventRequest;
import com.urban_events.api.model.Event;
import com.urban_events.api.model.User;
import com.urban_events.api.dto.EventResponse;
import com.urban_events.api.dto.UserResponse;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .tags(event.getTags())
                .organizer(UserResponse.builder()
                        .id(event.getOrganizer().getId())
                        .fullName(event.getOrganizer().getFullName())
                        .email(event.getOrganizer().getEmail())
                        .build())
                .build();
    }

    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAllWithOrganizers();
        return events.stream().map(this::mapToResponse).toList();
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event with ID '" + id + "' not found."));
        return mapToResponse(event);
    }

    public EventResponse createEvent(CreateEventRequest event, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer with email '" + organizerEmail + "' not found."));

        Event newEvent = Event.builder()
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .tags(event.getTags())
                .organizer(organizer)
                .build();

        Event savedEvent = eventRepository.save(newEvent);
        return mapToResponse(savedEvent);
    }
}

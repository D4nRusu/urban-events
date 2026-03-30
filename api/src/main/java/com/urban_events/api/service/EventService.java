package com.urban_events.api.service;

import org.springframework.stereotype.Service;

import com.urban_events.api.repository.EventRepository;
import com.urban_events.api.repository.UserRepository;
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

    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAllWithOrganizers();
        return events.stream().map(event -> EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .tags(event.getTags())
                .organizer(UserResponse.builder()
                        .id(event.getOrganizer().getId())
                        .email(event.getOrganizer().getEmail())
                        .fullName(event.getOrganizer().getFullName())
                        .build())
                .build()).toList();
    }

    public EventResponse createEvent(CreateEventRequest event, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer with email '" + organizerEmail + "' not found."));

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
        return EventResponse.builder()
                .id(savedEvent.getId())
                .title(savedEvent.getTitle())
                .description(savedEvent.getDescription())
                .eventDate(savedEvent.getEventDate())
                .location(savedEvent.getLocation())
                .imageUrl(savedEvent.getImageUrl())
                .tags(savedEvent.getTags())
                .organizer(UserResponse.builder()
                        .id(organizer.getId())
                        .email(organizer.getEmail())
                        .fullName(organizer.getFullName())
                        .build())
                .build();
    }
}

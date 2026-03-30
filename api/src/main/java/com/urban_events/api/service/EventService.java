package com.urban_events.api.service;

import org.springframework.stereotype.Service;

import com.urban_events.api.repository.EventRepository;
import com.urban_events.api.repository.UserRepository;
import com.urban_events.api.dto.CreateEventRequest;
import com.urban_events.api.model.Event;
import com.urban_events.api.model.User;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(CreateEventRequest event, String organizerEmail) {
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
                
        return eventRepository.save(newEvent);
    }
}

package com.urban_events.api.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.urban_events.api.exceptions.ResourceNotFoundException;
import com.urban_events.api.model.Booking;
import com.urban_events.api.model.Event;
import com.urban_events.api.model.User;
import com.urban_events.api.repository.BookingRepository;
import com.urban_events.api.repository.EventRepository;
import com.urban_events.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public void bookEvent(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // check if booked already
        if (bookingRepository.findByUserAndEvent(user, event).isPresent()) {
            throw new IllegalStateException("You are already attending this event");
        }

        // create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setBookingDate(LocalDateTime.now());

        bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Booking booking = bookingRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found")); 
        bookingRepository.delete(booking);
    }

}

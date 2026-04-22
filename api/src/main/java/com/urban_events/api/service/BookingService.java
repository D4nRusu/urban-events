package com.urban_events.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    public String bookEvent(Long eventId, String userEmail) { // also unbooks if booked
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        Optional<Booking> existing = bookingRepository.findByUserAndEvent(user, event);

        if (existing.isPresent()) {
            bookingRepository.delete(existing.get());
            return "unbooked";
        } else {
            // create booking
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setEvent(event);
            booking.setBookingDate(LocalDateTime.now());
            bookingRepository.save(booking);
            return "booked";
        }
    }

    public List<Booking> findAllByUser(User user) {
        return bookingRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("No bookings found for user"));
    }
}

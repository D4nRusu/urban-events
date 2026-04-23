package com.urban_events.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.urban_events.api.model.Booking;
import com.urban_events.api.model.Event;
import com.urban_events.api.model.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByUserAndEvent(User user, Event event); // check if user is already booked for an event
    List<Booking> findByUser(User user); // events a user is attending
    long countByEventId(Long eventId); // number of attendees
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.user WHERE b.event.id = :eventId")
    List<Booking> findByEventIdWithUser(@Param("eventId") Long eventId);
}

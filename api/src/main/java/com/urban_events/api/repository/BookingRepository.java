package com.urban_events.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.urban_events.api.model.Booking;
import com.urban_events.api.model.Event;
import com.urban_events.api.model.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByUserAndEvent(User user, Event event);
    long countByEventId(Long eventId);
    Optional<List<Booking>> findByUser(User user);
}

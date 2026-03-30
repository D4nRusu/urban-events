package com.urban_events.api.repository;

import org.springframework.stereotype.Repository;
import com.urban_events.api.model.Event;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findById(Long id);
    Optional<Event> findByTitle(String title);
}

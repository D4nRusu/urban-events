package com.urban_events.api.repository;

import org.springframework.stereotype.Repository;
import com.urban_events.api.model.Event;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @EntityGraph(attributePaths = {"organizer", "tags"})
    Optional<Event> findById(Long id);
    
    Optional<Event> findByTitle(String title);

    @EntityGraph(attributePaths = {"organizer", "tags"})
    @Query("SELECT e FROM Event e JOIN FETCH e.organizer")
    List<Event> findAllWithOrganizers();
}

# urban-events

Entities:
    - User: ID, Name, Password, Email(?), Role
    - Event: ID, Title, Description, Location, Tag_ID, Organizer_ID
    - Booking: ID, User_ID, Event_ID, Timestamp
    - Tags(?): ID, Name
    - Preferences (?): User_ID, Tag_ID

Spring:
    - Spring Web
    - Spring Data JPA
    - Spring Security
    - PostgreSQL Driver
    - Lombok
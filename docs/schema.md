%% flowchart TD
%%     A[Need room booking] -->|View available| B(Go shopping)
%%     B --> C{Let me think}
%%     C -->|One| D[Laptop]
%%     C -->|Two| E[iPhone]
%%     C -->|Three| F[fa:fa-car Car]
  
  erDiagram
    TEAMS {
        int TeamID PK
        string TeamName
        string Department
    }

    COLLEAGUES {
        int ColleagueID PK
        string EmployeeName
        string EmployeeEmail
        int TeamID FK
    }

    DESKS {
        int DeskID PK
        string DeskLabel
        string LocationFloor
    }

    ROOMS {
        int RoomID PK
        string RoomName
        int Capacity
    }

    DESK_BOOKINGS {
        int DeskBookingID PK
        int ColleagueID FK
        int DeskID FK
        date BookingDate
    }

    ROOM_BOOKINGS {
        int RoomBookingID PK
        int ColleagueID FK
        int RoomID FK
        date BookingDate
        time StartTime
        time EndTime
    }

    TEAMS ||--o{ COLLEAGUES : "belongs to"
    COLLEAGUES ||--o{ DESK_BOOKINGS : "makes"
    DESKS ||--o{ DESK_BOOKINGS : "receives"
    COLLEAGUES ||--o{ ROOM_BOOKINGS : "books"
    ROOMS ||--o{ ROOM_BOOKINGS : "is booked"


## Tables

| Table | Primary Key | Foreign Keys |
|---------|---------|---------|
| TEAM | team_id | None |
| EMPLOYEE | employee_id | team_id |
| DESK | desk_id | None |
| ROOM | room_id | None |
| DESK_BOOKING | desk_booking_id | employee_id, desk_id |
| ROOM_BOOKING | room_booking_id | employee_id, room_id |





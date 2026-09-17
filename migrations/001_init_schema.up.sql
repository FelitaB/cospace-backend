CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    team_id INT,
    FOREIGN KEY (team_id) 
        REFERENCES teams(id)
        ON DELETE SET NULL
);

CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    capacity INT NOT NULL
);

CREATE TABLE desks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    floor INT NOT NULL
);

CREATE TABLE bookings (
    user_id INT,
    desk_id INT,
    booking_date DATE NOT NULL,
    PRIMARY KEY (user_id, desk_id, booking_date),
    FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (desk_id) 
        REFERENCES desks(id)
        ON DELETE CASCADE
);




-- Run after migrations/001_init_schema.up.sql against empty tables.
INSERT INTO teams (id, name, department) VALUES
(1, 'Gary''s Team', 'Data Science'),
(2, 'Linda''s Team', 'Human Insight'),
(3, 'Joe''s Team', 'AED');

INSERT INTO users (id, first_name, last_name, email, team_id) VALUES
(1, 'Felita', 'Benoy', 'felita.benoy@paconsulting.com', 1),
(2, 'Benedek', 'Toth', 'benedek.toth@paconsulting.com', 1),
(3, 'Aaron', 'Furnell', 'aaron.furnell@paconsulting.com', 3),
(4, 'Samy', 'Oullaf', 'samy.oullaf@paconsulting.com', 3),
(5, 'Victoria', 'Oladejo', 'victoria.oladejo@paconsulting.com', 2),
(6, 'Tae', 'Dover-Richards', 'tae.dover-richards@paconsulting.com', 2),
(7, 'Emma', 'Stevenson', 'emma.stevenson@paconsulting.com', 1),
(8, 'Eamon', 'Sherlock', 'eamon.sherlock@paconsulting.com', 3);

INSERT INTO rooms (id, name, floor, capacity) VALUES
(1, 'Room 1', 6, 8),
(2, 'Room 2', 6, 5),
(3, 'Room 3', 7, 3);

INSERT INTO desks (id, name, floor) VALUES
(1, 'Desk 1', 6),
(2, 'Desk 2', 6),
(3, 'Desk 3', 7),
(4, 'Desk 4', 7);

INSERT INTO bookings (user_id, desk_id, booking_date) VALUES
(1, 1, '2026-10-01'),
(1, 1, '2026-10-02'),
(2, 2, '2026-10-01'),
(3, 3, '2026-10-01'),
(4, 4, '2026-10-01'),
(5, 2, '2026-10-02');

SELECT
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    t.name AS team_name,
    COUNT(b.desk_id) AS total_desks_booked
FROM users AS u
LEFT JOIN teams AS t ON t.id = u.team_id
LEFT JOIN bookings AS b ON b.user_id = u.id
GROUP BY u.id, u.first_name, u.last_name, t.id, t.name
ORDER BY u.id;

UPDATE users
SET team_id = 2
WHERE id = 8;

DELETE FROM desks
WHERE id = 1;

-- ON DELETE CASCADE removes desk 1's bookings; this count should be 0.
SELECT COUNT(*) AS remaining_bookings_for_deleted_desk
FROM bookings
WHERE desk_id = 1;
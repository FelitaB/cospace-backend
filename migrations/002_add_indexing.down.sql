ALTER TABLE bookings
DROP FOREIGN KEY bookings_ibfk_2;

DROP INDEX idx_bookings_desk_date ON bookings;

ALTER TABLE bookings
ADD CONSTRAINT bookings_ibfk_2
FOREIGN KEY (desk_id) REFERENCES desks(id)
ON DELETE CASCADE;












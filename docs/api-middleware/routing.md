# Routing

## Route Planning

| Method | Path | Payload | Success Status |
|----------|----------|----------|----------|
| GET | /bookings | None | 200 |
| GET | /bookings/:id | None | 200 |
| POST | /bookings | Booking object | 201 |
| PUT | /bookings/:id | Booking object | 200 |
| PATCH | /bookings/:id | None | 200 |
| DELETE | /bookings/:id | None | 204 |

## Successful POST

Request:

```bash
curl -X POST http://localhost:5000/bookings \
-H "Content-Type: application/json" \
-d '{
  "id":"4",
  "desk":"D401",
  "floor":4,
  "date":"2026-09-25",
  "active":true
}'


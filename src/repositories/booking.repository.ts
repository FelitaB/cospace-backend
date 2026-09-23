import { Booking as BookingInput } from "../schemas/booking.schema";

export type Booking = BookingInput & { id: string };

export class BookingRepository {
    private bookings: Booking[] = [
        {
            id: "1",
            desk: "A101",
            floor: "Floor 1",
            date: "2026-09-22",
            active: true,
        },
        {
            id: "2",
            desk: "B205",
            floor: "Floor 2",
            date: "2026-09-23",
            active: true,
        },
        {
            id: "3",
            desk: "C310",
            floor: "Floor 3",
            date: "2026-09-24",
            active: false,
        },
    ];

    findAll(): Booking[] {
        return [...this.bookings];
    }

    findById(id: string): Booking | undefined {
        return this.bookings.find((booking) => booking.id === id);
    }

    create(booking: Booking): Booking {
        this.bookings.push(booking);
        return booking;
    }

    update(id: string, data: Partial<Booking>): Booking | undefined {
        const index = this.bookings.findIndex((booking) => booking.id === id);
        const existing = this.bookings[index];

        if (index === -1 || !existing) {
            return undefined;
        }

        const updated: Booking = {
            ...existing,
            ...data,
            id,
        };

        this.bookings[index] = updated;

        return updated;
    }

    delete(id: string): boolean {
        const index = this.bookings.findIndex((booking) => booking.id === id);

        if (index === -1) {
            return false;
        }

        this.bookings.splice(index, 1);
        return true;
    }
}

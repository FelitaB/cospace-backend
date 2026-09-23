import { Booking, BookingRepository } from "../repositories/booking.repository";

export class BookingService {
    constructor(private readonly bookingRepository: BookingRepository) {}

    findAll(): Booking[] {
        return this.bookingRepository.findAll();
    }

    findById(id: string): Booking | undefined {
        return this.bookingRepository.findById(id);
    }

    create(booking: Booking): Booking {
        if (!booking.desk || booking.desk.trim().length < 3) {
            throw new Error("Desk name must be at least 3 characters long.");
        }

        if (!booking.date) {
            throw new Error("Booking date is required.");
        }

        return this.bookingRepository.create(booking);
    }

    update(id: string, data: Partial<Booking>): Booking | undefined {
        if (data.desk !== undefined && (!data.desk || data.desk.trim().length < 3)) {
            throw new Error("Desk name must be at least 3 characters long.");
        }

        return this.bookingRepository.update(id, data);
    }

    toggleActive(id: string): Booking | undefined {
        const booking = this.bookingRepository.findById(id);

        if (!booking) {
            return undefined;
        }

        return this.bookingRepository.update(id, { active: !booking.active });
    }

    delete(id: string): boolean {
        return this.bookingRepository.delete(id);
    }
}

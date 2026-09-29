import { Booking, BookingRepository } from "../repositories/booking.repository";

export class BookingNotFoundError extends Error {
    readonly code = "BOOKING_NOT_FOUND";
    readonly status = 404;

    constructor(readonly bookingId: string) {
        super(`Booking with id "${bookingId}" was not found.`);
        this.name = "BookingNotFoundError";
    }
}

export type PaginatedBookings = {
    data: Booking[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
};

export class BookingService {
    constructor(private readonly bookingRepository: BookingRepository) {}

    findAll(): Booking[] {
        return this.bookingRepository.findAll();
    }

    getPaginatedShifts(page: number, limit: number): PaginatedBookings {
        const safePage = Math.max(1, Math.floor(page) || 1);
        const safeLimit = Math.max(1, Math.floor(limit) || 1);

        const total = this.bookingRepository.count();
        const totalPages = Math.ceil(total / safeLimit);
        const skip = (safePage - 1) * safeLimit;
        const data = this.bookingRepository.findPaginated(skip, safeLimit);

        return {
            data,
            meta: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages,
                hasPreviousPage: safePage > 1,
                hasNextPage: safePage < totalPages,
            },
        };
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

    update(id: string, data: Partial<Booking>): Booking {
        if (data.desk !== undefined && (!data.desk || data.desk.trim().length < 3)) {
            throw new Error("Desk name must be at least 3 characters long.");
        }

        const updated = this.bookingRepository.update(id, data);

        if (!updated) {
            throw new BookingNotFoundError(id);
        }

        return updated;
    }

    toggleActive(id: string): Booking {
        const booking = this.bookingRepository.findById(id);

        if (!booking) {
            throw new BookingNotFoundError(id);
        }

        return this.update(id, { active: !booking.active });
    }

    delete(id: string): void {
        const deleted = this.bookingRepository.delete(id);

        if (!deleted) {
            throw new BookingNotFoundError(id);
        }
    }
}

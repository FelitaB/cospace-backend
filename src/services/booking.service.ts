import {
    Booking,
    BookingRepository,
    CreateBookingData,
    UpdateBookingData,
} from "../repositories/booking.repository";
import { BadRequestError, NotFoundError } from "../errors";

export class BookingNotFoundError extends NotFoundError {
    readonly code = "BOOKING_NOT_FOUND";

    constructor(readonly bookingId: number) {
        super(`Booking with id "${bookingId}" was not found.`);
        Object.setPrototypeOf(this, new.target.prototype);
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

    findAll(): Promise<Booking[]> {
        return this.bookingRepository.findAll();
    }

    async getPaginatedShifts(page: number, limit: number): Promise<PaginatedBookings> {
        const safePage = Math.max(1, Math.floor(page) || 1);
        const safeLimit = Math.max(1, Math.floor(limit) || 1);

        const total = await this.bookingRepository.count();
        const totalPages = Math.ceil(total / safeLimit);
        const skip = (safePage - 1) * safeLimit;
        const data = await this.bookingRepository.findPaginated(skip, safeLimit);

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

    findById(id: number): Promise<Booking | null> {
        return this.bookingRepository.findById(id);
    }

    create(booking: CreateBookingData): Promise<Booking> {
        if (!booking.user_id || !booking.desk_id) {
            throw new BadRequestError("Both user_id and desk_id are required.");
        }

        if (!booking.booking_date) {
            throw new BadRequestError("Booking date is required.");
        }

        return this.bookingRepository.create(booking);
    }

    async update(id: number, data: UpdateBookingData): Promise<Booking> {
        const updated = await this.bookingRepository.update(id, data);

        if (!updated) {
            throw new BookingNotFoundError(id);
        }

        return updated;
    }

    async toggleActive(id: number): Promise<Booking> {
        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new BookingNotFoundError(id);
        }

        return this.update(id, { active: !booking.active });
    }

    async delete(id: number): Promise<void> {
        const deleted = await this.bookingRepository.delete(id);

        if (!deleted) {
            throw new BookingNotFoundError(id);
        }
    }
}

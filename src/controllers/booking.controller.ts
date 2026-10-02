import { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { CreateBookingData, UpdateBookingData } from "../repositories/booking.repository";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import { HttpStatus } from "../constants/httpStatus";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MIN_PAGE = 1;
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;

const parsePositiveInt = (value: unknown, fallback: number, min: number, max?: number): number => {
    const raw = Array.isArray(value) ? value[0] : value;

    if (typeof raw !== "string" && typeof raw !== "number") {
        return fallback;
    }

    const parsed = parseInt(String(raw), 10);

    if (Number.isNaN(parsed)) {
        return fallback;
    }

    const clamped = Math.max(min, parsed);

    return max !== undefined ? Math.min(clamped, max) : clamped;
};

const requireId = (id: string | string[] | undefined): number => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new BadRequestError("Booking id must be a positive integer");
    }

    return parsed;
};

export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parsePositiveInt(req.query.page, DEFAULT_PAGE, MIN_PAGE);
            const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT);

            const result = await this.bookingService.getPaginatedShifts(page, limit);
            res.status(HttpStatus.OK).json(result);
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = requireId(req.params.id);
            const booking = await this.bookingService.findById(id);

            if (!booking) {
                throw new NotFoundError("Booking not found");
            }

            res.status(HttpStatus.OK).json(booking);
        } catch (err) {
            next(err);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (userId === undefined) {
                throw new UnauthorizedError("Authentication required");
            }

            const booking: CreateBookingData = req.body;
            const createdBooking = await this.bookingService.create(userId, booking);
            res.status(HttpStatus.CREATED).json(createdBooking);
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = requireId(req.params.id);
            const data: UpdateBookingData = req.body;
            const updatedBooking = await this.bookingService.update(id, data);

            res.status(HttpStatus.OK).json(updatedBooking);
        } catch (err) {
            next(err);
        }
    };

    toggleActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = requireId(req.params.id);
            const booking = await this.bookingService.toggleActive(id);

            res.status(HttpStatus.OK).json(booking);
        } catch (err) {
            next(err);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = requireId(req.params.id);
            await this.bookingService.delete(id);

            res.status(HttpStatus.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}

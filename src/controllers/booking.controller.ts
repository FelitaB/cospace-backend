import { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { Booking } from "../repositories/booking.repository";
import { BadRequestError, NotFoundError } from "../errors";
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

const requireId = (id: string | string[] | undefined): string => {
    if (typeof id !== "string" || id.length === 0) {
        throw new BadRequestError("Booking id is required");
    }

    return id;
};

export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    getAll = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const page = parsePositiveInt(req.query.page, DEFAULT_PAGE, MIN_PAGE);
            const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT);

            const result = this.bookingService.getPaginatedShifts(page, limit);
            res.status(HttpStatus.OK).json(result);
        } catch (err) {
            next(err);
        }
    };

    getById = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = requireId(req.params.id);
            const booking = this.bookingService.findById(id);

            if (!booking) {
                throw new NotFoundError("Booking not found");
            }

            res.status(HttpStatus.OK).json(booking);
        } catch (err) {
            next(err);
        }
    };

    create = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const booking: Booking = req.body;
            const createdBooking = this.bookingService.create(booking);
            res.status(HttpStatus.CREATED).json(createdBooking);
        } catch (err) {
            next(err);
        }
    };

    update = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = requireId(req.params.id);
            const data: Partial<Booking> = req.body;
            const updatedBooking = this.bookingService.update(id, data);

            res.status(HttpStatus.OK).json(updatedBooking);
        } catch (err) {
            next(err);
        }
    };

    toggleActive = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = requireId(req.params.id);
            const booking = this.bookingService.toggleActive(id);

            res.status(HttpStatus.OK).json(booking);
        } catch (err) {
            next(err);
        }
    };

    delete = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = requireId(req.params.id);
            this.bookingService.delete(id);

            res.status(HttpStatus.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}

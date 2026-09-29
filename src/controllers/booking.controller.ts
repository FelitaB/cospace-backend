import { Request, Response } from "express";
import { BookingNotFoundError, BookingService } from "../services/booking.service";
import { Booking } from "../repositories/booking.repository";

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

export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    getAll = (req: Request, res: Response): void => {
        try {
            const page = parsePositiveInt(req.query.page, DEFAULT_PAGE, MIN_PAGE);
            const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT);

            const result = this.bookingService.getPaginatedShifts(page, limit);
            res.status(200).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unexpected error";
            res.status(500).json({ error: message });
        }
    };

    getById = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                res.status(400).json({ error: "Booking id is required" });
                return;
            }

            const booking = this.bookingService.findById(id);

            if (!booking) {
                res.status(404).json({ error: "Booking not found" });
                return;
            }

            res.status(200).json(booking);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unexpected error";
            res.status(500).json({ error: message });
        }
    };

    create = (req: Request, res: Response): void => {
        try {
            const booking: Booking = req.body;
            const createdBooking = this.bookingService.create(booking);
            res.status(201).json(createdBooking);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unexpected error";

            if (message.toLowerCase().includes("desk")) {
                res.status(400).json({ error: message });
                return;
            }

            res.status(500).json({ error: message });
        }
    };

    update = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                res.status(400).json({ error: "Booking id is required" });
                return;
            }

            const data: Partial<Booking> = req.body;
            const updatedBooking = this.bookingService.update(id, data);

            res.status(200).json(updatedBooking);
        } catch (error) {
            if (error instanceof BookingNotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }

            const message = error instanceof Error ? error.message : "Unexpected error";

            if (message.toLowerCase().includes("desk")) {
                res.status(400).json({ error: message });
                return;
            }

            res.status(500).json({ error: message });
        }
    };

    toggleActive = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                res.status(400).json({ error: "Booking id is required" });
                return;
            }

            const booking = this.bookingService.toggleActive(id);

            res.status(200).json(booking);
        } catch (error) {
            if (error instanceof BookingNotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }

            const message = error instanceof Error ? error.message : "Unexpected error";
            res.status(500).json({ error: message });
        }
    };

    delete = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                res.status(400).json({ error: "Booking id is required" });
                return;
            }

            this.bookingService.delete(id);

            res.status(204).send();
        } catch (error) {
            if (error instanceof BookingNotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }

            const message = error instanceof Error ? error.message : "Unexpected error";
            res.status(500).json({ error: message });
        }
    };
}

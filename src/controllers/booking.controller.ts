import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { Booking } from "../repositories/booking.repository";

export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    getAll = (_req: Request, res: Response): void => {
        try {
            const bookings = this.bookingService.findAll();
            res.status(200).json(bookings);
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

            if (!updatedBooking) {
                res.status(404).json({ error: "Booking not found" });
                return;
            }

            res.status(200).json(updatedBooking);
        } catch (error) {
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

    delete = (req: Request, res: Response): void => {
        try {
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                res.status(400).json({ error: "Booking id is required" });
                return;
            }

            const deleted = this.bookingService.delete(id);

            if (!deleted) {
                res.status(404).json({ error: "Booking not found" });
                return;
            }

            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unexpected error";
            res.status(500).json({ error: message });
        }
    };
}

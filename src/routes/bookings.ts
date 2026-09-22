import { Router, Request, Response } from "express";

const router = Router();

interface Booking {
    id: string;
    desk: string;
    floor: number;
    date: string;
    active: boolean;
}

const bookings: Booking[] = [
    {
        id: "1",
        desk: "A101",
        floor: 1,
        date: "2026-09-22",
        active: true,
    },
    {
        id: "2",
        desk: "B205",
        floor: 2,
        date: "2026-09-23",
        active: true,
    },
    {
        id: "3",
        desk: "C310",
        floor: 3,
        date: "2026-09-24",
        active: false,
    },
];


router.get("/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    const booking = bookings.find(
        (booking) => booking.id === id,
    );

    if (!booking) {
        return res.status(404).json({
            error: "Booking not found",
        });
    }

    return res.status(200).json(booking);
});

router.post("/", (req: Request, res: Response) => {
    const newBooking: Booking = req.body;

    bookings.push(newBooking);

    return res.status(201).json(newBooking);
});

router.put("/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    const index = bookings.findIndex(
        (booking) => booking.id === id,
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Booking not found",
        });
    }

    const updatedBooking: Booking = {
        ...req.body,
        id,
    };

    bookings[index] = updatedBooking;

    return res.status(200).json(updatedBooking);
});

router.patch("/:id", (req: Request, res: Response) => {
    const id = req.params.id;

    const index = bookings.findIndex(
        (booking) => booking.id === id,
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Booking not found",
        });
    }

    const booking = bookings[index];

    if (!booking) {
        return res.status(404).json({
            error: "Booking not found",
        });
    }

    booking.active = !booking.active;

    return res.status(200).json(booking);
});


router.delete("/:id", (req: Request, res: Response) => {
    const id =req.params.id;

    const index = bookings.findIndex(
        (booking) => booking.id === id,
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Booking not found",
        });
    }

    bookings.splice(index, 1);

return res.status(204).send();
});

export default router;

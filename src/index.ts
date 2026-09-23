import express, { Request, Response } from "express";
import app from "./server";
import bookingRouter from "./routes/booking.routes";
import logger from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";

const port = 5000;

app.use(express.json());
app.use(logger);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "active",
        message: "CoSpace API is running",
    });
});

app.use("/bookings", bookingRouter);

// Must stay last so it sees errors from every route above it.
app.use(errorHandler);

app.listen(port);

export default app;

process.on("SIGTERM", () => {
    process.exit(0);
});

process.on("SIGINT", () => {
    process.exit(0);
});


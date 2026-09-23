import express, { Request, Response } from "express";
import bookingRouter from "./routes/booking.routes";

const app = express();
const port = 5000;

app.use(express.json());
app.use("/bookings", bookingRouter);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "active",
        message: "CoSpace API is running",
    });
});

app.listen(port);

export default app;


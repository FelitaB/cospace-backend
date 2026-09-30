import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { BookingService } from "../services/booking.service";
import { BookingRepository } from "../repositories/booking.repository";
import auth from "../middleware/auth";
import validate from "../middleware/validate";

const router = Router();

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

router.get("/", bookingController.getAll);
router.get("/:id", bookingController.getById);
router.post("/", auth, validate(["user_id", "desk_id", "booking_date"]), bookingController.create);
router.put("/:id", auth, validate(["user_id", "desk_id", "booking_date"]), bookingController.update);
router.patch("/:id", auth, bookingController.toggleActive);
router.delete("/:id", auth, bookingController.delete);

export default router;

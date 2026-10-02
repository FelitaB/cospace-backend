import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { BookingService } from "../services/booking.service";
import { BookingRepository } from "../repositories/booking.repository";
import requireAuth from "../middleware/requireAuth";
import validate from "../middleware/validate";

const router = Router();

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

router.get("/", bookingController.getAll);
router.get("/:id", bookingController.getById);
router.post("/", requireAuth, validate(["desk_id", "booking_date"]), bookingController.create);
router.put("/:id", requireAuth, validate(["user_id", "desk_id", "booking_date"]), bookingController.update);
router.patch("/:id", requireAuth, bookingController.toggleActive);
router.delete("/:id", requireAuth, bookingController.delete);

export default router;

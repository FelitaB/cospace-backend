import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { BookingService } from "../services/booking.service";
import { BookingRepository } from "../repositories/booking.repository";

const router = Router();

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

router.get("/", (req, res) => bookingController.getAll(req, res));
router.get("/:id", (req, res) => bookingController.getById(req, res));
router.post("/", (req, res) => bookingController.create(req, res));
router.put("/:id", (req, res) => bookingController.update(req, res));
router.patch("/:id", (req, res) => bookingController.toggleActive(req, res));
router.delete("/:id", (req, res) => bookingController.delete(req, res));

export default router;

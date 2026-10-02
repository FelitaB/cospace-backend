import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { validateSchema } from "../middleware/validate";

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/register", validateSchema(registerSchema), authController.register);
router.post("/login", validateSchema(loginSchema), authController.login);

export default router;

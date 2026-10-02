import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { HttpStatus } from "../constants/httpStatus";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const input = req.body as RegisterInput;
            const user = await this.authService.register(input);

            res.status(HttpStatus.CREATED).json({ user });
        } catch (err) {
            next(err);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const input = req.body as LoginInput;
            const { token, user } = await this.authService.login(input);

            res.status(HttpStatus.OK).json({ token, user });
        } catch (err) {
            next(err);
        }
    };
}

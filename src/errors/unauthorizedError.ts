import { AppError } from "../utils/appError";
import { HttpStatus } from "../constants/httpStatus";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, HttpStatus.UNAUTHORIZED);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default UnauthorizedError;

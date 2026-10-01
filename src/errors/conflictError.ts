import { AppError } from "../utils/appError";
import { HttpStatus } from "../constants/httpStatus";

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, HttpStatus.CONFLICT);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default ConflictError;

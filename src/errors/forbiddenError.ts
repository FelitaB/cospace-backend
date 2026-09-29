import { AppError } from "../utils/appError";
import { HttpStatus } from "../constants/httpStatus";

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, HttpStatus.FORBIDDEN);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default ForbiddenError;

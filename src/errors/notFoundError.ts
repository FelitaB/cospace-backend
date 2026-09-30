import { AppError } from "../utils/appError";
import { HttpStatus } from "../constants/httpStatus";

export class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, HttpStatus.NOT_FOUND);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default NotFoundError;

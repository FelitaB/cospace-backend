import { AppError } from "../utils/appError";
import { HttpStatus } from "../constants/httpStatus";

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, HttpStatus.BAD_REQUEST);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default BadRequestError;

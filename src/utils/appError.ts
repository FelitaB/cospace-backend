import { HttpStatus, HttpStatusCode } from "../constants/httpStatus"; //root 

 export class AppError extends Error { 
    readonly statusCode: number;
    readonly status: "fail" | "error";
    readonly isOperational = true;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status =
            statusCode >= HttpStatus.BAD_REQUEST && statusCode < HttpStatus.INTERNAL_SERVER_ERROR
                ? "fail"
                : "error";
        this.name = new.target.name;

        // Keeps the constructor frame out of the trace so it points at the throw site.
        Error.captureStackTrace(this, new.target);

        // Restores the prototype chain so `instanceof` survives down-level compilation.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default AppError;

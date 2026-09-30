import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import { HttpStatus } from "../constants/httpStatus";

// body-parser tags its failures with `type` and an HTTP `status`.
type BodyParserError = Error & { type: string; status?: number };

function isBodyParserError(err: unknown): err is BodyParserError {
    return err instanceof Error && typeof (err as Partial<BodyParserError>).type === "string";
}

// Four parameters are required for Express to treat this as an error handler.
export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof ZodError) {
        const fieldErrors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        res.status(HttpStatus.BAD_REQUEST).json({
            status: "fail",
            message: "Validation failed",
            details: fieldErrors,
        });
        return;
    }

    if (err instanceof AppError && err.isOperational) {
        res.status(err.statusCode).json({ status: err.status, message: err.message });
        return;
    }

    if (isBodyParserError(err)) {
        if (err.type === "entity.too.large") {
            res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
                status: "fail",
                message: "Request payload is too large",
            });
            return;
        }

        if (err instanceof SyntaxError || err.type === "entity.parse.failed") {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: "fail",
                message: "Malformed JSON in request body",
            });
            return;
        }

        if (err.type === "encoding.unsupported" || err.type === "charset.unsupported") {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: "fail",
                message: "Unsupported request encoding",
            });
            return;
        }
    }

    // Unknown/programmer errors: log internally, never leak details to the client.
    console.error(err instanceof Error ? err.stack : err);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal Server Error",
    });
}

export default errorHandler;

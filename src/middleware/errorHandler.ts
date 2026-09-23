import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

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

        res.status(400).json({ status: "error", message: "Validation failed", details: fieldErrors });
        return;
    }

    console.error(err instanceof Error ? err.stack : err);

    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
}

export default errorHandler;

import { NextFunction, Request, Response } from "express";

// Four parameters are required for Express to treat this as an error handler.
export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
    console.error(err instanceof Error ? err.stack : err);

    if (res.headersSent) {
        next(err);
        return;
    }

    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
}

export default errorHandler;

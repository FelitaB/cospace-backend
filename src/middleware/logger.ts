import { NextFunction, Request, Response } from "express";

export function logger(req: Request, _res: Response, next: NextFunction): void {

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    // Hands control to the next middleware/route; without it the request hangs.
    next();
}

export default logger;



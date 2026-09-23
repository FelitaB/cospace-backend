import { NextFunction, Request, Response } from "express";

// Demo credential only - move to a secret store / env var before deploying.
const API_TOKEN = process.env.API_TOKEN ?? "super-secret-key";

export function auth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header) {
        res.status(401).json({
            status: "error",
            message: "Missing Authorization header",
        });
        return;
    }

    // Accepts either "Bearer <token>" or the raw token.
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();

    if (token !== API_TOKEN) {
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
        return;
    }

    next();
}

export default auth;

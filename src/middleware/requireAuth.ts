import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors";
import { verifyToken } from "../utils/auth";

// RFC 6750: the scheme is case-insensitive and separated by whitespace.
const BEARER_PATTERN = /^Bearer[ \t]+(\S+)$/i;

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    if (!header) {
        next(new UnauthorizedError("Missing Authorization header"));
        return;
    }

    const match = BEARER_PATTERN.exec(header.trim());

    if (!match?.[1]) {
        next(new UnauthorizedError("Authorization header must use the Bearer scheme"));
        return;
    }

    try {
        req.user = verifyToken(match[1]);
    } catch {
        // Deliberately opaque: the specific jwt failure is not the caller's business.
        next(new UnauthorizedError("Invalid or expired token"));
        return;
    }

    next();
}

export default requireAuth;

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { User } from "../generated/prisma/client";

dotenv.config();

const SALT_ROUNDS = 12;
const TOKEN_TTL = "1h";

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
}
const jwtSecret: string = secret;

export type TokenPayload = {
    userId: number;
    email: string;
};

export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateToken(user: Pick<User, "id" | "email">): string {
    return jwt.sign({ email: user.email }, jwtSecret, {
        subject: String(user.id),
        expiresIn: TOKEN_TTL,
        algorithm: "HS256",
    });
}

// Pinning the algorithm stops a forged token from downgrading to "none".
export function verifyToken(token: string): TokenPayload {
    const decoded: string | JwtPayload = jwt.verify(token, jwtSecret, {
        algorithms: ["HS256"],
    });

    if (typeof decoded === "string" || !decoded.sub || typeof decoded.email !== "string") {
        throw new jwt.JsonWebTokenError("Malformed token payload");
    }

    const userId = Number(decoded.sub);

    if (!Number.isInteger(userId)) {
        throw new jwt.JsonWebTokenError("Token subject is not a valid user id");
    }

    return { userId, email: decoded.email };
}

import { NextFunction, Request, Response } from "express";

export function validate(requiredFields: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const body = (req.body ?? {}) as Record<string, unknown>;

        const missingFields = requiredFields.filter((field) => {
            const value = body[field];
            return value === undefined || value === null || value === "";
        });

        if (missingFields.length > 0) {
            res.status(400).json({
                status: "error",
                message: "Missing required fields",
                missingFields,
            });
            return;
        }

        next();
    };
}

export default validate;

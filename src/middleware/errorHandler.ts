import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({ error: "Validation failed", details: fieldErrors });
    return;
  }

  const message = err instanceof Error ? err.message : "Unexpected error";
  res.status(500).json({ error: message });
}

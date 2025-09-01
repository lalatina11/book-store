import type { NextFunction, Request, Response } from "express";

import type ErrorResponse from "./interfaces/error-response.js";

import { dbConnect } from "./db/index.js";
import { ENV } from "./env.js";

export async function runDB(req: Request, res: Response, next: NextFunction) {
  await dbConnect();
  next();
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: ENV.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

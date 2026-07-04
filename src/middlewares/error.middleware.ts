import { ErrorRequestHandler } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/appError";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.details;
  } else if (error instanceof SyntaxError && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON payload";
  }

  const response: ErrorResponse = {
    success: false,
    message
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  if (env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

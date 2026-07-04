import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { ApiErrorDetail } from "../types/api-response.type";
import { AppError } from "../utils/appError";

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const errors: ApiErrorDetail[] = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }));

      next(new AppError("Validation failed", 400, errors));
      return;
    }

    const parsed = result.data as {
      body?: unknown;
      params?: Request["params"];
      query?: Request["query"];
    };

    if (parsed.body !== undefined) {
      req.body = parsed.body;
    }

    if (parsed.params !== undefined) {
      req.params = parsed.params;
    }

    if (parsed.query !== undefined) {
      req.query = parsed.query;
    }

    next();
  };

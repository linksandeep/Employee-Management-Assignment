import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    DB_HOST: z.string().optional(),
    DB_PORT: z.coerce.number().int().positive().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_NAME: z.string().optional(),
    DATABASE_URL: z.string().url().optional()
  })
  .superRefine((data, ctx) => {
    if (data.DATABASE_URL) {
      return;
    }

    const requiredDbFields = [
      "DB_HOST",
      "DB_PORT",
      "DB_USER",
      "DB_PASSWORD",
      "DB_NAME"
    ] as const;

    requiredDbFields.forEach((field) => {
      if (!data[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required when DATABASE_URL is not provided`
        });
      }
    });
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.flatten().fieldErrors;
  console.error("Invalid environment variables:", errors);
  process.exit(1);
}

export const env = parsedEnv.data;

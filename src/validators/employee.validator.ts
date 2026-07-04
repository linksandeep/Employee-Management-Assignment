import { z } from "zod";

const employeeStatusSchema = z.enum(["active", "inactive"]);

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+()\-0-9\s]{7,20}$/, "Phone number must be valid")
  .nullable()
  .optional();

const employeeBodySchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255).toLowerCase(),
    phone: phoneSchema,
    position: z.string().trim().min(1).max(100),
    department: z.string().trim().min(1).max(100),
    salary: z.coerce.number().positive().max(9999999999),
    status: employeeStatusSchema.optional()
  })
  .strict();

export const employeeIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive()
  })
});

export const createEmployeeSchema = z.object({
  body: employeeBodySchema
});

export const updateEmployeeSchema = z.object({
  params: employeeIdParamSchema.shape.params,
  body: employeeBodySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update"
    })
});

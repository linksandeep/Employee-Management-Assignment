import { Router } from "express";
import * as employeeController from "../controllers/employee.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createEmployeeSchema,
  employeeIdParamSchema,
  updateEmployeeSchema
} from "../validators/employee.validator";

const router = Router();

router.post("/", validate(createEmployeeSchema), employeeController.createEmployee);
router.get("/", employeeController.getAllEmployees);
router.get(
  "/:id",
  validate(employeeIdParamSchema),
  employeeController.getEmployeeById
);
router.put(
  "/:id",
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);
router.delete(
  "/:id",
  validate(employeeIdParamSchema),
  employeeController.deleteEmployee
);

export default router;

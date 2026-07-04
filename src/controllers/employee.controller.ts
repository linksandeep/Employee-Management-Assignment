import { Request, Response } from "express";
import * as employeeService from "../services/employee.service";
import { sendSuccessResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createEmployee = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employee = await employeeService.createEmployee(req.body);

    sendSuccessResponse(res, 201, "Employee created successfully", employee);
  }
);

export const getAllEmployees = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const employees = await employeeService.getAllEmployees();

    sendSuccessResponse(res, 200, "Employees fetched successfully", {
      count: employees.length,
      employees
    });
  }
);

export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employee = await employeeService.getEmployeeById(
      Number(req.params.id)
    );

    sendSuccessResponse(res, 200, "Employee fetched successfully", employee);
  }
);

export const updateEmployee = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const employee = await employeeService.updateEmployee(
      Number(req.params.id),
      req.body
    );

    sendSuccessResponse(res, 200, "Employee updated successfully", employee);
  }
);

export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await employeeService.deleteEmployee(Number(req.params.id));

    sendSuccessResponse(res, 200, "Employee deleted successfully");
  }
);

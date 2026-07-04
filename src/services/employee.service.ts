import { QueryResult } from "pg";
import { pool } from "../config/database";
import {
  CreateEmployeeInput,
  Employee,
  EmployeeRow,
  UpdateEmployeeInput,
  mapEmployeeRowToEmployee
} from "../models";
import { AppError } from "../utils/appError";

const handleDatabaseError = (error: unknown): never => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    throw new AppError("Employee with this email already exists", 409);
  }

  throw error;
};

export const createEmployee = async (
  employee: CreateEmployeeInput
): Promise<Employee> => {
  const query = `
    INSERT INTO employees (
      first_name,
      last_name,
      email,
      phone,
      position,
      department,
      salary,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'active'))
    RETURNING *;
  `;

  const values = [
    employee.firstName,
    employee.lastName,
    employee.email,
    employee.phone ?? null,
    employee.position,
    employee.department,
    employee.salary,
    employee.status
  ];

  try {
    const result: QueryResult<EmployeeRow> = await pool.query(query, values);
    return mapEmployeeRowToEmployee(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(error);
  }
};

export const getAllEmployees = async (): Promise<Employee[]> => {
  const result: QueryResult<EmployeeRow> = await pool.query(
    "SELECT * FROM employees ORDER BY created_at DESC;"
  );

  return result.rows.map(mapEmployeeRowToEmployee);
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const result: QueryResult<EmployeeRow> = await pool.query(
    "SELECT * FROM employees WHERE id = $1;",
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Employee not found", 404);
  }

  return mapEmployeeRowToEmployee(result.rows[0]);
};

export const updateEmployee = async (
  id: number,
  employee: UpdateEmployeeInput
): Promise<Employee> => {
  const columnMap: Record<keyof UpdateEmployeeInput, string> = {
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    phone: "phone",
    position: "position",
    department: "department",
    salary: "salary",
    status: "status"
  };

  const values: unknown[] = [];
  const setClauses = Object.entries(employee)
    .filter(([, value]) => value !== undefined)
    .map(([key, value], index) => {
      values.push(value);
      return `${columnMap[key as keyof UpdateEmployeeInput]} = $${index + 1}`;
    });

  values.push(id);

  const query = `
    UPDATE employees
    SET ${setClauses.join(", ")}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *;
  `;

  try {
    const result: QueryResult<EmployeeRow> = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw new AppError("Employee not found", 404);
    }

    return mapEmployeeRowToEmployee(result.rows[0]);
  } catch (error) {
    return handleDatabaseError(error);
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  const result: QueryResult<EmployeeRow> = await pool.query(
    "DELETE FROM employees WHERE id = $1 RETURNING *;",
    [id]
  );

  if (result.rowCount === 0) {
    throw new AppError("Employee not found", 404);
  }
};

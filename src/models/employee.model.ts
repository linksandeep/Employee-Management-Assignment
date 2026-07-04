export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string;
  salary: string;
  status: EmployeeStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  position: string;
  department: string;
  salary: number;
  status?: EmployeeStatus;
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export const mapEmployeeRowToEmployee = (row: EmployeeRow): Employee => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  position: row.position,
  department: row.department,
  salary: Number(row.salary),
  status: row.status,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString()
});

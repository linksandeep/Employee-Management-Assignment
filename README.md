
<!-- run all in one time  -->
download docker first than run 

npm install
cp -n .env.example .env
npm run postgres:up
npm run dev



# Employee Management API

This is a small REST API for managing employees. It uses Express with TypeScript and stores employee records in PostgreSQL.

I kept the project limited to the requested CRUD work only. There is no login, role handling, file upload, dashboard, or extra module added on top.

## Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- `pg` for database queries
- Zod for request validation

## Project Structure

```text
assignment/
├── database/
│   └── schema.sql
├── postman/
│   └── employee-management-api.postman_collection.json
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
├── .env.example
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

The default `.env.example` values match the PostgreSQL Docker setup in this project:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=employee_management
```

## PostgreSQL Setup

PostgreSQL is used through the official `pg` package. The project includes both the SQL schema and a Docker Compose file for running Postgres locally.

Start PostgreSQL with Docker:

```bash
npm run postgres:up
```

The first time the container starts, it runs:

```text
database/schema.sql
```

If you already have PostgreSQL installed locally, create the database and run the schema manually:

```bash
createdb employee_management
npm run db:setup
```

Stop the Docker database:

```bash
npm run postgres:down
```

## Run the API

Development mode:

```bash
npm run dev
```

Build the TypeScript code:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

Base URL:

```text
http://localhost:3000
```

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## cURL Examples

Create employee:

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Aarav",
    "lastName": "Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+91 9876543210",
    "position": "Backend Developer",
    "department": "Engineering",
    "salary": 75000,
    "status": "active"
  }'
```

Get all employees:

```bash
curl http://localhost:3000/api/employees
```

Get employee by ID:

```bash
curl http://localhost:3000/api/employees/1
```

Update employee:

```bash
curl -X PUT http://localhost:3000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "position": "Senior Backend Developer",
    "salary": 90000
  }'
```

Delete employee:

```bash
curl -X DELETE http://localhost:3000/api/employees/1
```

## Postman

A ready-to-import Postman collection is available here:

```text
postman/employee-management-api.postman_collection.json
```

After importing it, keep these collection variables:

```text
baseUrl = http://localhost:3000
employeeId = 1
```

Create one employee first, then use the returned `id` as `employeeId` for the get, update, and delete requests.

## Request Body

Create employee:

```json
{
  "firstName": "Aarav",
  "lastName": "Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "+91 9876543210",
  "position": "Backend Developer",
  "department": "Engineering",
  "salary": 75000,
  "status": "active"
}
```

Update employee accepts any of these fields:

```json
{
  "firstName": "Aarav",
  "lastName": "Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "+91 9876543210",
  "position": "Senior Backend Developer",
  "department": "Engineering",
  "salary": 90000,
  "status": "active"
}
```

## Response Examples

Create success:

```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "firstName": "Aarav",
    "lastName": "Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+91 9876543210",
    "position": "Backend Developer",
    "department": "Engineering",
    "salary": 75000,
    "status": "active",
    "createdAt": "2026-07-04T10:00:00.000Z",
    "updatedAt": "2026-07-04T10:00:00.000Z"
  }
}
```

Get all success:

```json
{
  "success": true,
  "message": "Employees fetched successfully",
  "data": {
    "count": 1,
    "employees": [
      {
        "id": 1,
        "firstName": "Aarav",
        "lastName": "Sharma",
        "email": "aarav.sharma@example.com",
        "phone": "+91 9876543210",
        "position": "Backend Developer",
        "department": "Engineering",
        "salary": 75000,
        "status": "active",
        "createdAt": "2026-07-04T10:00:00.000Z",
        "updatedAt": "2026-07-04T10:00:00.000Z"
      }
    ]
  }
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.email",
      "message": "Invalid email"
    }
  ]
}
```

Employee not found:

```json
{
  "success": false,
  "message": "Employee not found"
}
```

## Validation Notes

- `firstName`, `lastName`, `email`, `position`, `department`, and `salary` are required when creating an employee.
- `email` must be valid and unique.
- `salary` must be greater than `0`.
- `status` can be `active` or `inactive`.
- `phone` is optional.
- Update requests must contain at least one field.

## Database Table

```sql
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  salary NUMERIC(12, 2) NOT NULL CHECK (salary > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Useful Commands

```bash
npm run postgres:up
npm run dev
npm run build
npm start
npm run postgres:down
```

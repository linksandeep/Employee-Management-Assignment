import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool(
  env.DATABASE_URL
    ? {
        connectionString: env.DATABASE_URL
      }
    : {
        host: env.DB_HOST as string,
        port: env.DB_PORT as number,
        user: env.DB_USER as string,
        password: env.DB_PASSWORD as string,
        database: env.DB_NAME as string
      }
);

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

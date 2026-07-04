import app from "./app";
import { pool } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await pool.query("SELECT 1");

    const server = app.listen(env.PORT, () => {
      console.log(`Employee Management API running on port ${env.PORT}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

void startServer();

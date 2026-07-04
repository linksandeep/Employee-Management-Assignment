import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

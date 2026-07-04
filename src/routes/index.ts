import { Router } from "express";
import employeeRoutes from "./employee.routes";

const router = Router();

router.use("/employees", employeeRoutes);

export default router;

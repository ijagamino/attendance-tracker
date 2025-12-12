import express from "express";
import authRoutes from "./auth.ts";
import attendanceRecordRoutes from "./attendance-records.ts";
import userRoutes from "./users.ts";
import dashboardRoutes from "./dashboard.ts";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api/attendance-records", attendanceRecordRoutes);
router.use("/api/users", userRoutes);
router.use("/api/dashboard", dashboardRoutes);

export default router;

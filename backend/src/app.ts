// backend/src/app.ts
import express from "express";
import cors from "cors";
import "reflect-metadata";
import authRoutes from "./routes/auth.routes";
import softwareRoutes from "./routes/software.routes";
import requestRoutes from "./routes/request.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/software", softwareRoutes);
app.use("/api/requests", requestRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

export default app;

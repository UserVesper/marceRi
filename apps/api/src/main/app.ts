import express, { type Express } from "express";
import cors from "cors";
import { createHealthRoutes } from "../interface/http/routes/health.routes.js";
import { errorHandler } from "../interface/http/middlewares/errorHandler.js";

export function createApp(): Express {
  const app = express();

  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );

  app.use(express.json());

  // Rotas da API
  app.use("/api", createHealthRoutes());

  // Middleware de erro
  app.use(errorHandler);

  return app;
}

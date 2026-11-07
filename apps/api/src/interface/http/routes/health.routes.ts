import { Router } from "express";
import { HealthController } from "../controllers/HealthController.js";

export function createHealthRoutes(): Router {
  const router = Router();
  const controller = new HealthController();

  router.get("/health", controller.handle);

  return router;
}

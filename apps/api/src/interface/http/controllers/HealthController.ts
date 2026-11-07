import type { Request, Response } from "express";
import type { HealthCheckResponse } from "@marceri/shared";

export class HealthController {
  public handle = (_req: Request, res: Response): void => {
    const response: HealthCheckResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: "mock",
      version: "0.1.0"
    };

    res.status(200).json(response);
  };
}

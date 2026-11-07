import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../../../main/app.js";
import { HealthCheckResponseSchema } from "@marceri/shared";

describe("GET /api/health", () => {
  it("deve retornar 200 OK com payload válido conforme HealthCheckResponseSchema", async () => {
    const app = createApp();

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

    // Valida com o schema Zod do pacote shared
    const parseResult = HealthCheckResponseSchema.safeParse(response.body);
    expect(parseResult.success).toBe(true);

    if (parseResult.success) {
      expect(parseResult.data.status).toBe("ok");
      expect(parseResult.data.database).toBe("mock");
    }
  });
});

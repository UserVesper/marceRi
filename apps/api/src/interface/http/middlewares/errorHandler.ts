import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("🔥 [API Unhandled Error]:", err);

  const status = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = status === 500 ? "Erro interno no servidor." : err.message;

  res.status(status).json({
    status: "error",
    erro: message
  });
};

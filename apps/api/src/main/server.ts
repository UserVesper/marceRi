import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;

app.listen(PORT, () => {
  console.log(`🪵 [marceRI API] Servidor ativo e ouvindo em http://localhost:${PORT}`);
  console.log(`🩺 Health check disponível em http://localhost:${PORT}/api/health`);
});

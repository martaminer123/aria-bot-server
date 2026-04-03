import express, { type Express } from "express";
import cors from "cors";
import { logger } from "./lib/logger.js";
import router from "./routes/index.js";

const app: Express = express();

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pinoHttp = (await import("pino-http")).default;

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Aria Bot Server</title></head>
<body><h1>Aria Bot Server is running</h1></body>
</html>`);
});

app.use("/api", router);

export default app;

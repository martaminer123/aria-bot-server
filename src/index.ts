import app from "./app";
import { logger } from "./lib/logger";
import Anthropic from "@anthropic-ai/sdk";

console.log("CLAUDE_API_KEY starts with:", process.env.CLAUDE_API_KEY?.substring(0, 15) || "NOT SET");

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Startup test: verify Anthropic API key is valid and working
  const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
  anthropic.messages
    .create({
      model: "claude-haiku-4-5",
      max_tokens: 10,
      messages: [{ role: "user", content: "hi" }],
    })
    .then(() => {
      logger.info("Anthropic startup test PASSED — API key is valid and working");
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      logger.error({ err: message }, "Anthropic startup test FAILED — API key may be invalid or expired");
    });
});

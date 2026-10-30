import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { loadConfig } from "./config.js";
import { logger } from "./logger.js";
import { createServer } from "./server.js";

const config = loadConfig();

const handle = serveStdio(() => createServer());

logger.info({ name: config.name, version: config.version }, "server listening on stdio");

function shutdown(signal: string): void {
  logger.info({ signal }, "shutting down");
  void handle.close().finally(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

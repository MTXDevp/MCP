import { createServer as createHttpServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import {
  localhostHostValidation,
  localhostOriginValidation,
} from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { loadConfig } from "./config.js";
import { logger } from "./logger.js";
import { createServer } from "./server.js";

const config = loadConfig();
const handler = createMcpHandler(() => createServer());
const nodeHandler = toNodeHandler(handler);
const validateHost = localhostHostValidation();
const validateOrigin = localhostOriginValidation();

const httpServer = createHttpServer((req, res) => {
  if (!validateHost(req, res) || !validateOrigin(req, res)) return;
  void nodeHandler(req, res);
});

httpServer.listen(config.port, "127.0.0.1", () => {
  logger.info({ port: config.port }, "server listening on http");
});

process.on("SIGINT", () => {
  httpServer.close();
  void handler.close().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  httpServer.close();
  void handler.close().finally(() => process.exit(0));
});

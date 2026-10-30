import { McpServer } from "@modelcontextprotocol/server";
import { loadConfig } from "./config.js";
import { registerPrompts } from "./prompts/index.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

export function createServer(): McpServer {
  const config = loadConfig();
  const server = new McpServer({ name: config.name, version: config.version });

  registerTools(server);
  registerResources(server, { name: config.name, version: config.version });
  registerPrompts(server);

  return server;
}

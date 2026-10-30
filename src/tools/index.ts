import type { McpServer } from "@modelcontextprotocol/server";
import { registerEchoTool } from "./echo.js";

export function registerTools(server: McpServer): void {
  registerEchoTool(server);
}

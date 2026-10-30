import type { McpServer } from "@modelcontextprotocol/server";
import { registerServerInfoResource } from "./server-info.js";

export function registerResources(
  server: McpServer,
  info: { name: string; version: string },
): void {
  registerServerInfoResource(server, info);
}

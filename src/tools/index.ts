import type { McpServer } from "@modelcontextprotocol/server";
import { registerEchoTool } from "./echo.js";
import { registerWhatsAppSendMessageTool } from "./whatsapp-send-message.js";

export function registerTools(server: McpServer): void {
  registerEchoTool(server);
  registerWhatsAppSendMessageTool(server);
}

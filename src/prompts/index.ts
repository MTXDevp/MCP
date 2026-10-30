import type { McpServer } from "@modelcontextprotocol/server";
import { registerSummarizePrompt } from "./summarize.js";

export function registerPrompts(server: McpServer): void {
  registerSummarizePrompt(server);
}

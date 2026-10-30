import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

export const echoInputSchema = z.object({
  text: z.string().min(1).describe("Text to echo back"),
});

export type EchoInput = z.output<typeof echoInputSchema>;

export function buildEchoText(input: EchoInput): string {
  return input.text;
}

export function registerEchoTool(server: McpServer): void {
  server.registerTool(
    "echo",
    {
      description: "Echo back the provided text. Health check for tool wiring.",
      inputSchema: echoInputSchema,
    },
    async (args) => ({
      content: [{ type: "text", text: buildEchoText(args) }],
    }),
  );
}

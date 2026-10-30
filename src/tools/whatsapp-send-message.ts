import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { createWhatsAppClient, type WhatsAppClient } from "../whatsapp/client.js";

export const sendMessageInputSchema = z.object({
  to: z
    .string()
    .regex(/^\+\d{7,15}$/)
    .describe("Recipient phone number in E.164 format, e.g. +34600111222"),
  text: z.string().min(1).max(4096).describe("Message text"),
});

export const sendMessageOutputSchema = z.object({
  messageId: z.string(),
  to: z.string(),
});

export function registerWhatsAppSendMessageTool(
  server: McpServer,
  client: WhatsAppClient = createWhatsAppClient(),
): void {
  server.registerTool(
    "whatsapp-send-message",
    {
      description: "Send a text message through WhatsApp. Returns the provider message id.",
      inputSchema: sendMessageInputSchema,
      outputSchema: sendMessageOutputSchema,
      annotations: { readOnlyHint: false },
    },
    async (args) => {
      const result = await client.sendText(args);
      return {
        content: [{ type: "text", text: `messageId=${result.messageId}` }],
        structuredContent: result,
      };
    },
  );
}

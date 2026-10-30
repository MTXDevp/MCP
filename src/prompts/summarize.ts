import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

const summarizeArgsSchema = z.object({
  text: z.string().min(1).describe("Text to summarize"),
});

export function registerSummarizePrompt(server: McpServer): void {
  server.registerPrompt(
    "summarize-text",
    {
      title: "Summarize text",
      description: "Build a summarization request for the provided text.",
      argsSchema: summarizeArgsSchema,
    },
    ({ text }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Summarize the following text in three bullet points:\n\n${text}`,
          },
        },
      ],
    }),
  );
}

# 02 — How to add a tool

1. Create `src/tools/<name>.ts`.
2. Define the input schema with Zod v4 and export the pure logic.
3. Add a `register<Name>Tool(server: McpServer)` function.
4. Register it in `src/tools/index.ts`.
5. Add a test for the pure logic in the same file or a colocated test.

Template:

```ts
import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

export const myToolInputSchema = z.object({
  query: z.string().min(1).describe("What to search for"),
});

export function runMyTool(input: z.output<typeof myToolInputSchema>): string {
  return input.query.trim();
}

export function registerMyTool(server: McpServer): void {
  server.registerTool(
    "my-tool",
    {
      description: "Search the index and return matching entries.",
      inputSchema: myToolInputSchema,
    },
    async (args) => ({
      content: [{ type: "text", text: runMyTool(args) }],
    }),
  );
}
```

Checklist before opening a PR:

- `npm run typecheck` passes.
- `npm test` passes.
- The tool was exercised with the Inspector
  (`npm run build && npm run inspect`).

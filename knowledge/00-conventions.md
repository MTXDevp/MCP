# 00 — Conventions (mandatory)

## Language and tone

- Wording is plain and technical. No emojis anywhere: code, comments,
  log messages, tool names, tool descriptions, prompt texts, resource
  texts, markdown docs, commit messages.
- No filler adjectives in descriptions. A tool description states what the
  tool does, its input, and its output. One sentence where possible.

## TypeScript

- `strict: true`. Fix type errors, do not suppress them with `any`.
- ESM with explicit `.js` extension in relative imports.

## MCP protocol rules

- stdout is the protocol channel on stdio. The only allowed writer to
  stdout is the SDK transport. Application code logs to stderr via
  `src/logger.ts`.
- Every tool defines `inputSchema` as a Zod v4 object (`z.object({...})`).
  A tool without arguments omits `inputSchema`.
- Use `.describe()` on schema fields. That text is the only documentation
  the model sees for the argument.
- A tool handler returns `{ content: [...] }`. Add `structuredContent`
  together with `outputSchema` only when a machine-readable result is
  needed. Both must match.
- Resources are read-only. Never mutate state from a resource callback.
- Destructive tools set `annotations: { readOnlyHint: false,
  destructiveHint: true }` so hosts can ask for confirmation.

## Errors

- Expected failures (not found, invalid state) are returned as
  `{ content: [{ type: "text", text: <message> }], isError: true }`.
- Unexpected failures are thrown. The SDK converts them into protocol
  errors. Do not leak secrets or stack traces in the message.

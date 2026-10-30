# Agent instructions

This file and `knowledge/` are the permanent instruction set for this repository.
Read them before changing code. This file is the canonical source and works
with any coding agent; `opencode.json` only re-declares the same files so
OpenCode loads them automatically.

## Source of truth

1. `knowledge/00-conventions.md` — mandatory style and MCP rules.
2. `knowledge/01-architecture.md` — where each piece of the server lives.
3. `knowledge/02-how-to-add-a-tool.md` — procedure for adding tools.
4. `knowledge/03-transports.md` — stdio and HTTP rules.
5. `knowledge/04-workflow.md` — branching workflow. Every branch starts from `main`.

## Working rules

- TypeScript strict, ESM (`import ... from "./x.js"` with extension).
- Validate every tool input with a Zod v4 schema. Never trust client input.
- Never write to stdout from the server process. stdout is the MCP channel.
  Logs go to stderr through `src/logger.ts`.
- No emojis in code, comments, log messages, tool descriptions, or commit
  messages. Plain technical wording.
- Keep the factory in `src/server.ts` side-effect free: registration only.
  Heavy clients, pools and caches live at module scope.
- Run `npm run typecheck` and `npm test` before considering a change done.

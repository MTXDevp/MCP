# 01 — Architecture

```
src/
  index.ts        # stdio entrypoint. Calls serveStdio with the factory.
  http.ts         # Streamable HTTP entrypoint on 127.0.0.1 + host/origin checks.
  server.ts       # createServer() factory. Registration only, no side effects.
  config.ts       # Env parsing and validation (zod). Defaults live here.
  logger.ts       # pino to stderr. Import this, never console.log.
  tools/          # One file per tool + index.ts that registers all of them.
  resources/      # One file per resource or template + index.ts.
  prompts/        # One file per prompt + index.ts.
  *.test.ts       # node:test tests next to the unit under test.
```

## Design notes

- `createServer()` builds a fresh `McpServer` on every call. The stdio
  entrypoint calls it once per process; the HTTP handler calls it once per
  request. Anything expensive (DB pools, HTTP clients) must be created at
  module scope and closed over, never inside the factory.
- Tool logic that can be tested without the protocol lives in a pure
  exported function (see `buildEchoText` in `tools/echo.ts`). The
  `register*` function only wires it to the server.
- `dist/` is build output and is not committed. `.env` is local config and
  is not committed. `.env.example` documents the variables.

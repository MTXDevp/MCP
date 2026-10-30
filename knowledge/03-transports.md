# 03 — Transports

## stdio (`src/index.ts`)

- Used when a host launches the server as a child process (Claude Code,
  VS Code, Inspector).
- `serveStdio(() => createServer())` owns the transport. The factory
  builds the instance that serves the connection.
- Never write to stdout. Log with `logger` (stderr). A single stray
  `console.log` corrupts the JSON-RPC stream.
- The process exits when the client closes stdin. Release timers, pools
  and watchers on close so the event loop can drain.

## Streamable HTTP (`src/http.ts`)

- Used when one endpoint serves many clients.
- `createMcpHandler(() => createServer())` builds one fresh instance per
  request. No state on the instance.
- The server binds to `127.0.0.1` and validates `Host` and `Origin`
  headers in front of the handler. This blocks DNS rebinding against a
  local server.
- The handler verifies no token by itself. If authentication is needed,
  verify the bearer token in front of the handler and pass the result as
  `handler.fetch(request, { authInfo })`.

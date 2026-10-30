import pino from "pino";

// MCP stdio uses stdout as the protocol channel. All logs go to stderr.
export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
    base: undefined,
  },
  process.stderr,
);

import * as z from "zod/v4";

const configSchema = z.object({
  name: z.string().min(1).default("mcp-server"),
  version: z.string().min(1).default("0.1.0"),
  port: z.coerce.number().int().min(1).max(65535).default(3000),
  logLevel: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
});

export type AppConfig = z.output<typeof configSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return configSchema.parse({
    name: env.MCP_SERVER_NAME ?? undefined,
    version: env.MCP_SERVER_VERSION ?? undefined,
    port: env.MCP_PORT ?? undefined,
    logLevel: env.LOG_LEVEL ?? undefined,
  });
}

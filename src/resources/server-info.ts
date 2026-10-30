import type { McpServer } from "@modelcontextprotocol/server";

export const SERVER_INFO_URI = "server://info";

export function buildServerInfoText(input: {
  name: string;
  version: string;
  startedAt: string;
}): string {
  return JSON.stringify(input, null, 2);
}

export function registerServerInfoResource(
  server: McpServer,
  info: { name: string; version: string },
): void {
  const startedAt = new Date().toISOString();

  server.registerResource(
    "server-info",
    SERVER_INFO_URI,
    {
      title: "Server Info",
      description: "Static server metadata: name, version and start time.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: buildServerInfoText({ ...info, startedAt }),
        },
      ],
    }),
  );
}

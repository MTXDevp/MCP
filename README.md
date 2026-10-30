# MCP Server

Base server for the Model Context Protocol (SDK v2, TypeScript) with stdio
and Streamable HTTP transports. One example tool, one resource and one
prompt so the wiring can be verified end to end.

## Requirements

- Node.js 20+
- npm

## Setup

```sh
cp .env.example .env
npm install
npm run typecheck
npm test
npm run build
```

## Run

stdio (used by hosts that spawn the server):

```sh
npm start
```

HTTP (local endpoint for many clients):

```sh
npm run start:http
```

Development (no build step):

```sh
npm run dev
npm run dev:http
```

## Verify with the Inspector

```sh
npm run build
npm run inspect
```

Connect, then exercise `echo` (tools), `server://info` (resources) and
`summarize-text` (prompts).

## Configure a host

VS Code example (`.vscode/mcp.json` is included):

```json
{
  "servers": {
    "mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"]
    }
  }
}
```

## Add a tool

See `knowledge/02-how-to-add-a-tool.md`. Short version: new file in
`src/tools/`, Zod v4 `inputSchema`, pure logic exported for tests,
registration in `src/tools/index.ts`.

## WhatsApp

Base implementation on the Cloud API (`src/whatsapp/`). Without
`WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` the server uses a
stub client that records messages in memory, so tools and tests run without
credentials. The `whatsapp-send-message` tool accepts an E.164 number and
returns the provider message id.

## Permanent instructions

- `AGENTS.md` — entry point for agents working in this repo.
- `knowledge/` — conventions, architecture, transports. Read in order.

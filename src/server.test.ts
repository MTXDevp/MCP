import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { loadConfig } from "./config.js";
import { buildEchoText } from "./tools/echo.js";
import { buildServerInfoText } from "./resources/server-info.js";

describe("config", () => {
  it("applies defaults when env is empty", () => {
    const config = loadConfig({});
    assert.equal(config.name, "mcp-server");
    assert.equal(config.port, 3000);
  });

  it("rejects an out-of-range port", () => {
    assert.throws(() => loadConfig({ MCP_PORT: "99999" }));
  });
});

describe("echo tool", () => {
  it("returns the input text unchanged", () => {
    assert.equal(buildEchoText({ text: "hola" }), "hola");
  });
});

describe("server-info resource", () => {
  it("serializes metadata as JSON", () => {
    const text = buildServerInfoText({
      name: "mcp-server",
      version: "0.1.0",
      startedAt: "2026-01-01T00:00:00.000Z",
    });
    const parsed = JSON.parse(text) as { name: string };
    assert.equal(parsed.name, "mcp-server");
  });
});

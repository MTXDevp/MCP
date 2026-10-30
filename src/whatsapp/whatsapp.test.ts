import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  CloudApiWhatsAppClient,
  StubWhatsAppClient,
  WhatsAppError,
  createWhatsAppClient,
} from "./client.js";
import { isWhatsAppConfigured, loadWhatsAppConfig } from "./config.js";
import { sendMessageInputSchema } from "../tools/whatsapp-send-message.js";

describe("whatsapp config", () => {
  it("is not configured without credentials", () => {
    const config = loadWhatsAppConfig({});
    assert.equal(isWhatsAppConfigured(config), false);
    assert.equal(config.apiBaseUrl, "https://graph.facebook.com");
  });

  it("is configured with token and phone number id", () => {
    const config = loadWhatsAppConfig({
      WHATSAPP_ACCESS_TOKEN: "token",
      WHATSAPP_PHONE_NUMBER_ID: "123",
    });
    assert.equal(isWhatsAppConfigured(config), true);
  });

  it("falls back to the stub client without credentials", () => {
    const client = createWhatsAppClient({});
    assert.ok(client instanceof StubWhatsAppClient);
  });
});

describe("stub client", () => {
  it("records sent messages with deterministic ids", async () => {
    const client = new StubWhatsAppClient();
    const result = await client.sendText({ to: "+34600111222", text: "hola" });
    assert.equal(result.messageId, "stub-1");
    assert.deepEqual(client.sent, [{ to: "+34600111222", text: "hola" }]);
  });
});

describe("cloud api client", () => {
  it("posts to the messages endpoint and returns the message id", async () => {
    let seenUrl = "";
    let seenInit: RequestInit | undefined;
    const fakeFetch = (async (url: string, init?: RequestInit) => {
      seenUrl = url;
      seenInit = init;
      return new Response(JSON.stringify({ messages: [{ id: "wamid.1" }] }), { status: 200 });
    }) as typeof fetch;

    const client = new CloudApiWhatsAppClient(
      {
        apiBaseUrl: "https://graph.facebook.com",
        apiVersion: "v21.0",
        accessToken: "test-token",
        phoneNumberId: "123",
      },
      fakeFetch,
    );
    const result = await client.sendText({ to: "+34600111222", text: "hola" });
    assert.equal(result.messageId, "wamid.1");
    assert.equal(seenUrl, "https://graph.facebook.com/v21.0/123/messages");
    assert.deepEqual(JSON.parse(seenInit?.body as string), {
      messaging_product: "whatsapp",
      to: "+34600111222",
      type: "text",
      text: { body: "hola" },
    });
  });

  it("throws WhatsAppError without leaking the token", async () => {
    const fakeFetch = (async () =>
      new Response("invalid token", { status: 401 })) as typeof fetch;
    const client = new CloudApiWhatsAppClient(
      {
        apiBaseUrl: "https://graph.facebook.com",
        apiVersion: "v21.0",
        accessToken: "secret-token",
        phoneNumberId: "123",
      },
      fakeFetch,
    );
    await assert.rejects(() => client.sendText({ to: "+34600111222", text: "hola" }), (error) => {
      assert.ok(error instanceof WhatsAppError);
      assert.equal((error as WhatsAppError).status, 401);
      assert.equal((error as Error).message.includes("secret-token"), false);
      return true;
    });
  });
});

describe("send message schema", () => {
  it("rejects phone numbers outside E.164 and empty text", () => {
    assert.equal(sendMessageInputSchema.safeParse({ to: "600111222", text: "hola" }).success, false);
    assert.equal(
      sendMessageInputSchema.safeParse({ to: "+34600111222", text: "" }).success,
      false,
    );
    assert.equal(
      sendMessageInputSchema.safeParse({ to: "+34600111222", text: "hola" }).success,
      true,
    );
  });
});

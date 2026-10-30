import { logger } from "../logger.js";
import { isWhatsAppConfigured, loadWhatsAppConfig, type WhatsAppConfig } from "./config.js";

export interface SendTextMessageInput {
  to: string;
  text: string;
}

export interface WhatsAppSendResult {
  messageId: string;
  to: string;
}

export interface WhatsAppClient {
  sendText(input: SendTextMessageInput): Promise<WhatsAppSendResult>;
}

export class WhatsAppError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(`WhatsApp API error (status ${status}): ${message}`);
    this.name = "WhatsAppError";
    this.status = status;
  }
}

type FetchFn = typeof fetch;

export class CloudApiWhatsAppClient implements WhatsAppClient {
  private readonly config: WhatsAppConfig;
  private readonly fetchFn: FetchFn;

  constructor(config: WhatsAppConfig, fetchFn: FetchFn = fetch) {
    this.config = config;
    this.fetchFn = fetchFn;
  }

  async sendText(input: SendTextMessageInput): Promise<WhatsAppSendResult> {
    const url =
      `${this.config.apiBaseUrl}/${this.config.apiVersion}` +
      `/${this.config.phoneNumberId}/messages`;
    const response = await this.fetchFn(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: input.to,
        type: "text",
        text: { body: input.text },
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new WhatsAppError(response.status, detail.slice(0, 200));
    }
    const payload = (await response.json()) as { messages?: Array<{ id?: string }> };
    const messageId = payload.messages?.[0]?.id;
    if (!messageId) {
      throw new WhatsAppError(response.status, "response did not contain a message id");
    }
    return { messageId, to: input.to };
  }
}

export class StubWhatsAppClient implements WhatsAppClient {
  readonly sent: SendTextMessageInput[] = [];

  async sendText(input: SendTextMessageInput): Promise<WhatsAppSendResult> {
    this.sent.push(input);
    return { messageId: `stub-${this.sent.length}`, to: input.to };
  }
}

export function createWhatsAppClient(env: NodeJS.ProcessEnv = process.env): WhatsAppClient {
  const config = loadWhatsAppConfig(env);
  if (!isWhatsAppConfigured(config)) {
    logger.warn("WhatsApp credentials missing, using stub client");
    return new StubWhatsAppClient();
  }
  return new CloudApiWhatsAppClient(config);
}

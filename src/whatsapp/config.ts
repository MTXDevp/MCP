import * as z from "zod/v4";

const whatsappEnvSchema = z.object({
  apiBaseUrl: z.string().min(1).default("https://graph.facebook.com"),
  apiVersion: z.string().min(1).default("v21.0"),
  accessToken: z.string().optional(),
  phoneNumberId: z.string().optional(),
});

export interface WhatsAppConfig {
  apiBaseUrl: string;
  apiVersion: string;
  accessToken: string;
  phoneNumberId: string;
}

export function loadWhatsAppConfig(env: NodeJS.ProcessEnv = process.env): WhatsAppConfig {
  const parsed = whatsappEnvSchema.parse({
    apiBaseUrl: env.WHATSAPP_API_BASE_URL ?? undefined,
    apiVersion: env.WHATSAPP_API_VERSION ?? undefined,
    accessToken: env.WHATSAPP_ACCESS_TOKEN ?? undefined,
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID ?? undefined,
  });
  return {
    apiBaseUrl: parsed.apiBaseUrl,
    apiVersion: parsed.apiVersion,
    accessToken: parsed.accessToken ?? "",
    phoneNumberId: parsed.phoneNumberId ?? "",
  };
}

export function isWhatsAppConfigured(config: WhatsAppConfig): boolean {
  return config.accessToken.length > 0 && config.phoneNumberId.length > 0;
}

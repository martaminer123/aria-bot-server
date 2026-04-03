import { Router, type IRouter, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

const SYSTEM_PROMPT =
  "You are Aria, Marta's personal AI assistant. You are warm, concise, and conversational — like a smart, trusted friend who handles things. Never sound robotic. Keep responses short (2-3 sentences max unless asked for more). Use Marta's name sometimes. Always sign off with 💜. Never use bullet points or lists unless specifically asked. Talk like a real person, not an AI.";

async function generateReply(userMessage: string): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const res = await fetch(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp send failed: ${res.status} ${err}`);
  }
}

router.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    req.log.info("WhatsApp webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    req.log.warn({ mode, token }, "WhatsApp webhook verification failed");
    res.status(403).send("Forbidden");
  }
});

router.post("/webhook", (req: Request, res: Response) => {
  const body = req.body;

  req.log.info(
    { fullBody: JSON.stringify(body, null, 2) },
    "===== WEBHOOK EVENT RECEIVED =====",
  );

  res.status(200).send("EVENT_RECEIVED");

  if (body.object === "whatsapp_business_account") {
    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;

        for (const message of value?.messages ?? []) {
          req.log.info(
            {
              eventType: "INCOMING_MESSAGE",
              from: message.from,
              type: message.type,
              text: message.text?.body ?? null,
              timestamp: message.timestamp,
              messageId: message.id,
            },
            "===== INCOMING MESSAGE =====",
          );

          if (message.type === "text" && message.text?.body) {
            const from = message.from as string;
            const text = message.text.body as string;

            generateReply(text)
              .then((reply) => {
                req.log.info({ to: from, reply }, "Sending Claude reply");
                return sendWhatsAppMessage(from, reply);
              })
              .then(() => {
                req.log.info({ to: from }, "Reply sent successfully");
              })
              .catch((err: unknown) => {
                req.log.error({ err }, "Failed to generate or send reply");
              });
          }
        }

        for (const status of value?.statuses ?? []) {
          req.log.info(
            {
              eventType: "STATUS_UPDATE",
              messageId: status.id,
              status: status.status,
              recipientId: status.recipient_id,
              timestamp: status.timestamp,
              billable: status.pricing?.billable,
              category: status.pricing?.category,
            },
            "===== STATUS UPDATE =====",
          );
        }

        if (!value?.messages?.length && !value?.statuses?.length) {
          req.log.info(
            {
              eventType: "OTHER_EVENT",
              field: change.field,
              raw: JSON.stringify(value, null, 2),
            },
            "===== OTHER WEBHOOK EVENT =====",
          );
        }
      }
    }
  } else {
    req.log.warn(
      { object: body.object },
      "===== UNKNOWN WEBHOOK OBJECT =====",
    );
  }
});

export default router;

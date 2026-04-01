module.exports = async function (req, res) {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ACR123";

  // ===== VERIFICACIÓN =====
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Error");
    }
  }

  // ===== MENSAJES =====
  if (req.method === "POST") {
    try {
      const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
      const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

      if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error("FALTAN VARIABLES");
        return res.status(500).json({ error: "ENV faltante" });
      }

      const body = req.body;

      // RESPONDER RÁPIDO A META
      res.status(200).json({ received: true });

      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (!message) return;

      if (message.type !== "text") return;

      const from = message.from;
      const text = message.text?.body || "";

      const url = https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages;

      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: Bearer ${WHATSAPP_TOKEN},
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: OK: ${text},
          },
        }),
      });

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    return;
  }

  return res.status(405).send("No permitido");
};

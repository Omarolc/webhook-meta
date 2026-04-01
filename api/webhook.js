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
      console.log("🔥 ENTRÓ AL POST");

      const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
      const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

      if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        throw new Error("Faltan variables de entorno");
      }

      const body = req.body;

      console.log("BODY:", JSON.stringify(body));

      const message =
        body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      // RESPONDER SIEMPRE
      res.status(200).json({ received: true });

      if (!message) {
        console.log("No hay mensaje");
        return;
      }

      if (message.type !== "text") {
        console.log("No es texto");
        return;
      }

      const url = https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: Bearer ${WHATSAPP_TOKEN},
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "🔥 YA FUNCIONA 🔥" },
        }),
      });

      const data = await response.json();
      console.log("META:", data);

    } catch (error) {
      console.error("❌ ERROR REAL:", error);

      // IMPORTANTE: responder si falló antes
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
};

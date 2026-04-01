module.exports = async function (req, res) {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ACR123";

  // ===== VERIFICACIÓN META =====
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Error de verificación");
    }
  }

  // ===== WEBHOOK EVENT =====
  if (req.method === "POST") {
    try {
      // VALIDACIÓN VARIABLES
      const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
      const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

      if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error("❌ FALTAN VARIABLES DE ENTORNO");
        return res.status(500).json({ error: "ENV no configurado" });
      }

      const body = req.body;

      // RESPONDER RÁPIDO A META (EVITA REINTENTOS)
      res.status(200).json({ received: true });

      // PROCESAR ASÍNCRONO
      setImmediate(async () => {
        try {
          const changes = body.entry?.[0]?.changes || [];

          for (const change of changes) {
            const messages = change.value?.messages || [];

            for (const msg of messages) {
              // SOLO TEXTO
              if (msg.type !== "text") continue;

              const from = msg.from;
              const text = msg.text?.body;

              console.log("MENSAJE:", from, text);

              const url = https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages;

              const response = await fetch(url, {
                method: "POST",
                headers: {
                  Authorization: Bearer ${WHATSAPP_TOKEN},
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: from,
                  text: {
                    body: Recibido: ${text},
                  },
                }),
              });

              const data = await response.json();
              console.log("RESPUESTA META:", data);
            }
          }
        } catch (err) {
          console.error("❌ ERROR ASYNC:", err);
        }
      });

    } catch (error) {
      console.error("❌ ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    return;
  }

  return res.status(405).send("Método no permitido");
};

module.exports = async function (req, res) {
  const VERIFY_TOKEN = "ACR123";

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

  // ===== MENSAJES =====
  if (req.method === "POST") {
    try {
      // 🔥 VALIDACIÓN DE VARIABLES (AQUÍ ESTABA TU ERROR)
      if (!process.env.WHATSAPP_TOKEN || !process.env.PHONE_NUMBER_ID) {
        console.error("❌ FALTAN VARIABLES DE ENTORNO");
        return res.status(500).json({ error: "Faltan variables de entorno" });
      }

      const body = req.body;

      console.log("EVENTO:", JSON.stringify(body));

      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;

        const url = https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: Bearer ${process.env.WHATSAPP_TOKEN},
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: "Ya quedó 🔥",
            },
          }),
        });

        const data = await response.json();
        console.log("RESPUESTA META:", data);
      }

      return res.status(200).json({ ok: true });

    } catch (error) {
      console.error("❌ ERROR:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).send("Método no permitido");
};

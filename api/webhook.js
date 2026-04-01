export default async function handler(req, res) {
  const VERIFY_TOKEN = "ACR123";

  // 🔹 VERIFICACIÓN DE META
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Error de verificación");
    }
  }

  // 🔹 RECIBIR MENSAJES
  if (req.method === "POST") {
    try {
      const body = req.body;

      console.log("RECIBIDO:", JSON.stringify(body));

      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;

        // 🔥 RESPUESTA AUTOMÁTICA
        await fetch(
          https://graph.facebook.com/v18.0/${process.env.NUMERO_DE_TELEFONO_ID}/messages,
          {
            method: "POST",
            headers: {
              "Authorization": Bearer ${process.env.TOKEN_DE_WHATSAPP},
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              text: { body: "Ya quedó 🔥" },
            }),
          }
        );
      }

      return res.status(200).json({ ok: true });

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).send("Método no permitido");
}

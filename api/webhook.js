module.exports = async function handler(req, res) {
  const VERIFY_TOKEN = "ACR123";

  // 🔹 VERIFICACIÓN
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

  // 🔹 MENSAJES
  if (req.method === "POST") {
    const body = req.body;

    console.log("📩 Webhook:", JSON.stringify(body));

    const message =
      body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("De:", from);
      console.log("Texto:", text);

      await fetch(
        "https://graph.facebook.com/v18.0/1075972065598074/messages",
        {
          method: "POST",
          headers: {
            Authorization: Bearer TU_TOKEN_AQUI,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Ya funciona tu bot 🔥" },
          }),
        }
      );
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).send("Método no permitido");
};

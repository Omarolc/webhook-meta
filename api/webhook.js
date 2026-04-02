module.exports = async function (req, res) {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "ACR123";

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

  if (req.method === "POST") {
    try {
      const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
      const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

      if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error("FALTAN VARIABLES");
        return res.status(500).json({ error: "ENV mal" });
      }

      const body = req.body;

      res.status(200).json({ received: true });

      const message =
        body.entry &&
        body.entry[0] &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0];

      if (!message) return;

      const from = message.from;
      const text = message.text?.body || "";

      console.log("MENSAJE:", text);

      // 👉 VALIDACIÓN SIMPLE (SIN REGEX)
      let respuesta = "";

      if (!text.includes("_")) {
        respuesta = "Formato inválido. Usa: 4857_NL";
      } else {
        const partes = text.split("_");

        if (partes.length !== 2) {
          respuesta = "Formato inválido. Usa: 4857_NL";
        } else {
          const cuenta = partes[0];
          const codigo = partes[1];

          console.log("CUENTA:", cuenta, "CODIGO:", codigo);

          respuesta = Cuenta: ${cuenta}\nCódigo: ${codigo}\nOK;
        }
      }

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
          type: "text",
          text: { body: respuesta },
        }),
      });
    } catch (error) {
      console.error("ERROR:", error);
    }
  }
};

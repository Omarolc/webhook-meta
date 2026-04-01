const axios = require("axios");

module.exports = async (req, res) => {
  const VERIFY_TOKEN = "ACR123";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end();
    }
  }

  if (req.method === "POST") {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("Mensaje:", text);

      // RESPUESTA AUTOMÁTICA
      await axios.post(
        https://graph.facebook.com/v18.0/1075972065598074/messages,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Recibí tu mensaje: " + text }
        },
        {
          headers: {
            Authorization: Bearer TU_TOKEN,
            "Content-Type": "application/json"
          }
        }
      );
    }

    return res.status(200).end();
  }
};

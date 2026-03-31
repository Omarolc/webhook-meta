module.exports = async function (req, res) {

  // 🔐 VERIFICACIÓN (GET)
  if (req.method === 'GET') {
    const VERIFY_TOKEN = "ACR123";

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // 📩 RECEPCIÓN (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body;

      console.log("CUERPO:", JSON.stringify(body, null, 2));

      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body || "";

        console.log("MENSAJE:", text);

        // 🚀 RESPUESTA A WHATSAPP
        const response = await fetch(
          https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages,
          {
            method: "POST",
            headers: {
              "Authorization": Bearer ${process.env.WHATSAPP_TOKEN},
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: {
                body: "🔥 ACR activo: " + text,
              },
            }),
          }
        );

        const data = await response.json();
        console.log("META:", data);
      }

      return res.status(200).send("EVENT_RECEIVED");

    } catch (error) {
      console.error("ERROR:", error);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(405);
};

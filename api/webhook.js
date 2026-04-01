export default async function handler(req, res) {
  const VERIFY_TOKEN = "ACR123";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Error");
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;

      console.log("MENSAJE:", JSON.stringify(body));

      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;

        await fetch(
          "https://graph.facebook.com/v18.0/1075972065598074/messages",
          {
            method: "POST",
            headers: {
              "Authorization": "Bearer AQUI_PEGA_TU_TOKEN",
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

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  }
}

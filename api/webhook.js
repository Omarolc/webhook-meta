module.exports = async function (req, res) {
  console.log("🔥 VERSION NUEVA 🔥");

  if (req.method === 'GET') {
    const VERIFY_TOKEN = "ACR123";

    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.sendStatus(403);
  }

  if (req.method === 'POST') {
    try {
      const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;
        const text = message.text?.body || "";

        console.log("MENSAJE:", text);

        await fetch(
          https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages,
          {
            method: "POST",
            headers: {
              //deploy
              "Authorization": Bearer ${process.env.WHATSAPP_TOKEN},
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: {
                body: "OK: " + text,
              },
            }),
          }
        );
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(405);
};

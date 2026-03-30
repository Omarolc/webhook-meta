module.exports = async (req, res) => {

  const VERIFY_TOKEN = "ACR123";

  // 👉 Verificación de Meta
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // 👉 Recepción de mensajes
  if (req.method === 'POST') {
    try {
      console.log("MENSAJE RECIBIDO:", JSON.stringify(req.body));

      const phone_number_id = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
      const from = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

      if (from && phone_number_id) {

        await fetch(https://graph.facebook.com/v18.0/${phone_number_id}/messages, {
          method: "POST",
          headers: {
            "Authorization": Bearer ${process.env.WHATSAPP_TOKEN},
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Hola Omar, ACR ya está vivo 🚀" }
          })
        });

      }

      return res.status(200).send("ok");

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(200).send("ok");
    }
  }

  return res.status(200).send("ok");
};

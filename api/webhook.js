export default async function handler(req, res) {

  // ✅ VERIFICACIÓN (GET)
  if (req.method === 'GET') {
    const VERIFY_TOKEN = "123456"; // usa el mismo que pusiste en Meta

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Error de verificación');
    }
  }

  // ✅ RECEPCIÓN DE MENSAJES (POST)
  if (req.method === 'POST') {
    const body = req.body;

    console.log("🔥 WEBHOOK RECIBIDO:");
    console.log(JSON.stringify(body, null, 2));

    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages) {
        const from = messages[0].from;
        const text = messages[0].text?.body;

        console.log("📩 Mensaje de:", from);
        console.log("💬 Texto:", text);

        // 🚀 RESPUESTA AUTOMÁTICA
        await fetch(https://graph.facebook.com/v18.0/${value.metadata.phone_number_id}/messages, {
          method: "POST",
          headers: {
            "Authorization": Bearer ${process.env.WHATSAPP_TOKEN},
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: ACR: Recibí tu mensaje -> "${text}"
            }
          })
        });
      }

    } catch (error) {
      console.error("❌ Error:", error);
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).send("Método no permitido");
}

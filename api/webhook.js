export default async function handler(req, res) {
  // 🔐 TOKEN DE VERIFICACIÓN
  const VERIFY_TOKEN = "ACR123";

  // 🔹 VERIFICACIÓN META (GET)
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

  // 🔹 RECEPCIÓN DE MENSAJES (POST)
  if (req.method === "POST") {
    const body = req.body;

    console.log("📩 Webhook recibido:", JSON.stringify(body));

    const message =
      body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("👤 De:", from);
      console.log("💬 Texto:", text);

      // 🔥 RESPUESTA AUTOMÁTICA
      await fetch(
        "https://graph.facebook.com/v18.0/1075972065598074/messages",
        {
          method: "POST",
          headers: {
            Authorization: Bearer EAASGMfpSvMQBRN8IiSr3DIElZA4hb7qZCyxSnhIp0ruYu1OXcqrC7MvFfz3XJU5SYjHvhkdyn9JYpZBOEAeN424uhSuDJJmwZBNPvLIodqmDJYlHgTDs6sP3vtfcD2r9cwt1LnWgqLqjeorlhzW6CLbL2ca7FFdRQD1oKTmf8Jiws5FuqSPS0HZABMyfmEBidxoeyTT1o1sZAlKzqipPZAYkGdBluZCdzBBkaUFLBVlxc7bQsHKPP8ZBNwpA8g8yRoaQ7SxrDDIjL5oZBt1kZBVDlLgpZAvidgZDZD,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: "Hola 👋 soy tu bot, recibí tu mensaje correctamente",
            },
          }),
        }
      );
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).send("Método no permitido");
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body;

      console.log("CUERPO COMPLETO:", JSON.stringify(body));

      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;

      if (value?.messages) {
        const message = value.messages[0];
        const from = message.from;
        const text = message.text?.body;

        console.log("MENSAJE RECIBIDO:", text);

        // RESPUESTA AUTOMÁTICA
        await fetch(
          https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages,
          {
            method: "POST",
            headers: {
              Authorization: Bearer ${process.env.WHATSAPP_TOKEN},
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: Recibí tu mensaje: ${text},
              },
            }),
          }
        );
      }

      return res.status(200).send("ok");
    } catch (error) {
      console.error(error);
      return res.status(500).send("error");
    }
  }

  return res.status(200).send("ok");
}

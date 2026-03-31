module.exports = async function handler(req, res) {

  console.log("METODO:", req.method);

  if (req.method === "GET") {
    return res.status(200).send("OK");
  }

  if (req.method === "POST") {
    try {
      console.log("CUERPO:", JSON.stringify(req.body));

      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        const from = messages[0].from;

        console.log("MENSAJE DE:", from);

        await fetch(https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages, {
          method: "POST",
          headers: {
            "Authorization": Bearer ${process.env.WHATSAPP_TOKEN},
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: "ACR conectado 🚀" }
          })
        });
      }

      return res.status(200).send("OK");

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(200).send("ERROR");
    }
  }

  return res.status(200).send("OK");
}

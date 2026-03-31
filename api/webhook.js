module.exports = async (req, res) => {
  // =========================
  // 🔹 VERIFICACIÓN (META)
  // =========================
  if (req.method === "GET") {
    const VERIFY_TOKEN = "ACR123";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Error de verificación");
    }
  }

  // =========================
  // 🔹 MENSAJES ENTRANTES
  // =========================
  if (req.method === "POST") {
    try {
      const body = req.body;

      console.log("CUERPO COMPLETO:", JSON.stringify(body));

      const entry = body.entry && body.entry[0];
      const change = entry && entry.changes && entry.changes[0];
      const value = change && change.value;

      if (value && value.messages) {
        const message = value.messages[0];
        const from = message.from;
        const text = message.text && message.text.body;

        console.log("MENSAJE RECIBIDO:", text);

        // =========================
        // 🔹 ENVÍO DE RESPUESTA
        // =========================
        const url =
          "https://graph.facebook.com/v18.0/" +
          process.env.PHONE_NUMBER_ID +
          "/messages";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + process.env.WHATSAPP_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: "Recibí tu mensaje: " + text,
            },
          }),
        });

        const data = await response.json();

        console.log("RESPUESTA META:", JSON.stringify(data));
      } else {
        console.log("NO HAY MENSAJE, SOLO EVENTO");
      }

      return res.status(200).send("ok");
    } catch (error) {
      console.error("ERROR GENERAL:", error);
      return res.status(500).send("error");
    }
  }

  return res.status(200).send("ok");
};

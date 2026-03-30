const https = require("https");

module.exports = (req, res) => {

  const VERIFY_TOKEN = "ACR123";

  // 👉 Verificación
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

  // 👉 Mensajes
  if (req.method === 'POST') {
    try {
      console.log("MENSAJE RECIBIDO:");
      console.log(JSON.stringify(req.body, null, 2));

      const phone_number_id = req.body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id;
      const from = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

      if (from && phone_number_id) {

        const data = JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "ACR activo 🚀" }
        });

        const options = {
          hostname: "graph.facebook.com",
          path: /v18.0/${phone_number_id}/messages,
          method: "POST",
          headers: {
            "Authorization": Bearer ${process.env.WHATSAPP_TOKEN},
            "Content-Type": "application/json",
            "Content-Length": data.length
          }
        };

        const reqMeta = https.request(options, response => {
          response.on("data", d => {
            console.log("RESPUESTA META:", d.toString());
          });
        });

        reqMeta.on("error", error => {
          console.error("ERROR META:", error);
        });

        reqMeta.write(data);
        reqMeta.end();
      }

      return res.status(200).send("ok");

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(200).send("ok");
    }
  }

  return res.status(200).send("ok");
};

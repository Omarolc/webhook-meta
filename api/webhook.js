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

      const phone_number_id = req.body.entry &&
        req.body.entry[0] &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value &&
        req.body.entry[0].changes[0].value.metadata &&
        req.body.entry[0].changes[0].value.metadata.phone_number_id;

      const from = req.body.entry &&
        req.body.entry[0] &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0] &&
        req.body.entry[0].changes[0].value.messages[0].from;

      if (from && phone_number_id) {

        const data = JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "ACR ya quedó 🔥" }
        });

        const path = "/v18.0/" + phone_number_id + "/messages";

        console.log("RUTA:", path);

        const options = {
          hostname: "graph.facebook.com",
          path: path,
          method: "POST",
          headers: {
            "Authorization": "Bearer " + process.env.WHATSAPP_TOKEN,
            "Content-Type": "application/json",
            "Content-Length": data.length
          }
        };

        const reqMeta = https.request(options, response => {
          let body = "";
          response.on("data", chunk => body += chunk);
          response.on("end", () => {
            console.log("RESPUESTA META:", body);
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
      console.error("ERROR GENERAL:", error);

const https = require("https");

module.exports = (req, res) => {

  const VERIFY_TOKEN = "ACR123";

  // VERIFICACIÓN
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // MENSAJES
  if (req.method === "POST") {
    try {

      console.log("MENSAJE RECIBIDO:");
      console.log(JSON.stringify(req.body, null, 2));

      const entry = req.body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;

      const phone_number_id = value?.metadata?.phone_number_id;
      const from = value?.messages?.[0]?.from;

      if (from && phone_number_id) {

        const data = JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "ACR funcionando 🔥" }
        });

        const options = {
          hostname: "graph.facebook.com",
          path: "/v18.0/" + phone_number_id + "/messages",
          method: "POST",
          headers: {
            "Authorization": "Bearer " + process.env.WHATSAPP_TOKEN,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data)
          }
        };

        const reqMeta = https.request(options, (response) => {
          let body = "";
          response.on("data", chunk => body += chunk);
          response.on("end", () => {
            console.log("RESPUESTA META:", body);
          });
        });

        reqMeta.on("error", (error) => {
          console.error("ERROR META:", error);
        });

        reqMeta.write(data);
        reqMeta.end();
      }

      return res.status(200).send("ok");

    } catch (error) {
      console.error("ERROR GENERAL:", error);
      return res.status(200).send("ok");
    }
  }

  return res.status(200).send("ok");
};

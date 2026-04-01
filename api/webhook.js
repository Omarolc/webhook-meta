module.exports = async function (req, res) {
  const VERIFY_TOKEN = "ACR123";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end();
    }
  }

  if (req.method === "POST") {
    try {
      const entry = req.body.entry && req.body.entry[0];
      const changes = entry && entry.changes && entry.changes[0];
      const message = changes && changes.value && changes.value.messages && changes.value.messages[0];

      if (message) {
        const from = message.from;
        const text = message.text && message.text.body;

        console.log("Mensaje:", text);

        const https = require("https");

        const data = JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Recibí: " + text,
          },
        });

        const options = {
          hostname: "graph.facebook.com",
          path: "/v18.0/1075972065598074/messages",
          method: "POST",
          headers: {
            Authorization: "Bearer TU_TOKEN_REAL",
            "Content-Type": "application/json",
            "Content-Length": data.length,
          },
        };

        const request = https.request(options, (response) => {
          response.on("data", (chunk) => {
            console.log("Respuesta:", chunk.toString());
          });
        });

        request.on("error", (error) => {
          console.error("Error:", error);
        });

        request.write(data);
        request.end();
      }

      return res.status(200).end();
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(200).end();
    }
  }

  return res.status(405).end();
};

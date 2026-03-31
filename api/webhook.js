const fetch = require("node-fetch");

module.exports = async function handler(req, res) {

  if (req.method === "GET") {
    return res.status(200).send("OK");
  }

  if (req.method === "POST") {
    try {

      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        const from = messages[0].from;

        const phoneId = process.env.PHONE_NUMBER_ID;
        const token = process.env.WHATSAPP_TOKEN;

        if (!phoneId || !token) {
          console.log("Faltan variables");
          return res.status(200).send("Faltan variables");
        }

        const url = "https://graph.facebook.com/v18.0/" + phoneId + "/messages";

        await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: "ACR funcionando 🚀" }
          })
        });
      }

      return res.status(200).send("OK");

    } catch (error) {
      console.error("ERROR REAL:", error);
      return res.status(200).send("ERROR");
    }
  }

  return res.status(200).send("OK");
}

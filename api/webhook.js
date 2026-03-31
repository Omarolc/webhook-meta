module.exports = async function handler(req, res) {

  if (req.method === "GET") {
    return res.status(200).send("OK");
  }

  if (req.method === "POST") {
    try {

      console.log("CUERPO COMPLETO:", JSON.stringify(req.body));

      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const phoneId = process.env.PHONE_NUMBER_ID;
      const token = process.env.WHATSAPP_TOKEN;

      const url = "https://graph.facebook.com/v18.0/" + phoneId + "/messages";

      // 👇 RESPUESTA FORZADA (aunque no detecte mensaje)
      const from = value?.messages?.[0]?.from;

      if (from) {
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
      } else {
        console.log("NO HAY MENSAJE, SOLO EVENTO");
      }

      return res.status(200).send("OK");

    } catch (error) {
      console.error("ERROR REAL:", error);
      return res.status(200).send("ERROR");
    }
  }

  return res.status(200).send("OK");
}

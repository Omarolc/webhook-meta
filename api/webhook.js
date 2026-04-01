module.exports = (req, res) => {
  const VERIFY_TOKEN = "ACR123";

  // 🔹 GET (verificación de Meta)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFICADO");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  // 🔹 POST (mensajes)
  if (req.method === "POST") {
    console.log("MENSAJE RECIBIDO:", req.body);
    return res.sendStatus(200);
  }

  return res.sendStatus(405);
};

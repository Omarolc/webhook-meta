module.exports = (req, res) => {
  const VERIFY_TOKEN = "ACR123";

  // 🔹 VERIFICACIÓN (GET)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFICADO");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).end();
    }
  }

  // 🔹 MENSAJES (POST)
  if (req.method === "POST") {
    console.log("MENSAJE RECIBIDO:", req.body);
    return res.status(200).end();
  }

  return res.status(405).end();
};

export default function handler(req, res) {
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
      return res.sendStatus(403);
    }
  }

  // 🔹 RECEPCIÓN DE MENSAJES (POST)
  if (req.method === "POST") {
    console.log("MENSAJE RECIBIDO:", JSON.stringify(req.body, null, 2));
    return res.sendStatus(200);
  }

  return res.sendStatus(405);
}

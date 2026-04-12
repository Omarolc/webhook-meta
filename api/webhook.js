export default function handler(req, res) {
  if (req.method === "GET") {
    const VERIFY_TOKEN = "ACR123";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Error de verificación");
    }
  }

  if (req.method === "POST") {
    console.log("Mensaje recibido:", req.body);
    return res.status(200).send("OK");
  }

  return res.status(405).send("Método no permitido");
}

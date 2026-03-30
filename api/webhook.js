export default function handler(req, res) {

  const VERIFY_TOKEN = "ACR123";

  // 👉 VERIFICACIÓN (cuando Meta conecta)
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

  // 👉 MENSAJES (cuando llega WhatsApp)
  if (req.method === 'POST') {
    console.log("MENSAJE RECIBIDO:", JSON.stringify(req.body));
    return res.status(200).send("ok");
  }

  return res.sendStatus(405);
}

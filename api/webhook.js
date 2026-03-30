module.exports = (req, res) => {

  const VERIFY_TOKEN = "ACR123";

  // 👉 Verificación de Meta
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

  // 👉 Recepción de mensajes
  if (req.method === 'POST') {
    try {
      console.log("MENSAJE RECIBIDO:");
      console.log(JSON.stringify(req.body, null, 2));

      // 👉 Solo confirmamos recepción (SIN romper nada)
      return res.status(200).send("ok");

    } catch (error) {
      console.error("ERROR:", error);
      return res.status(200).send("ok");
    }
  }

  // 👉 Cualquier otro método
  return res.status(200).send("ok");
};

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const VERIFY_TOKEN = 'ACR123';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Error de verificación');
    }
  }

  if (req.method === 'POST') {

    const body = req.body;

    console.log('MENSAJE RECIBIDO:', JSON.stringify(body, null, 2));

    try {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const messages = value?.messages;

      if (messages) {
        const from = messages[0].from;

        await fetch(https://graph.facebook.com/v18.0/TU_PHONE_NUMBER_ID/messages, {
          method: 'POST',
          headers: {
            'Authorization': Bearer TU_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Hola, soy ACR 🤖" }
          })
        });
      }

    } catch (error) {
      console.log("ERROR:", error);
    }

    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).send('Método no permitido');
}

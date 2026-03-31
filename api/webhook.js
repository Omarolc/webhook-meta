export default async function handler(req, res) {

  // VALIDACIÓN META (GET)
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

  // RECEPCIÓN MENSAJES
  if (req.method === 'POST') {
    console.log('MENSAJE RECIBIDO:', JSON.stringify(req.body, null, 2));

    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).send('Método no permitido');
}

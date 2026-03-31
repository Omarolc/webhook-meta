export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return res.status(200).send('ok');
    }

    if (req.method === 'POST') {
      console.log('Webhook recibido:', req.body);
      return res.status(200).send('EVENT_RECEIVED');
    }

    return res.status(405).send('Method Not Allowed');

  } catch (error) {
    console.error('Error en webhook:', error);
    return res.status(500).send('Error interno');
  }
}

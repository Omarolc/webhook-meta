export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send('ok');
  }

  if (req.method === 'POST') {
    console.log('Webhook recibido:', req.body);
    return res.status(200).send('EVENT_RECEIVED');
  }

  res.status(405).send('Method Not Allowed');
}

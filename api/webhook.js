module.exports = (req, res) => {
  const VERIFY_TOKEN = 'ACR123';

  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Error');
    }
  }

  if (req.method === 'POST') {
    console.log('🔥 WEBHOOK RECIBIDO');
    console.log(req.body);

    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).end();
};

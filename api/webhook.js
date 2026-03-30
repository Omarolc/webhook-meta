export default async function handler(req, res) {
  if (req.method === 'GET') {
    const VERIFY_TOKEN = "123456"; // el que pusiste en Meta

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
  }

  if (req.method === 'POST') {
    try {
      console.log("BODY:", JSON.stringify(req.body));

      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error("ERROR:", error);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(405);
}

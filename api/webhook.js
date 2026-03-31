export default function handler(req, res) {

  // SOLO LOG
  console.log("ENTRÓ REQUEST:", req.method);

  if (req.method === 'GET') {
    return res.status(200).send("OK");
  }

  if (req.method === 'POST') {
    console.log("BODY:", req.body);
    return res.status(200).send("OK");
  }

  return res.status(200).send("OK");
}

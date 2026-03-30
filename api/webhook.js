module.exports = (req, res) => {

  if (req.method === 'GET') {
    return res.status(200).send("ok");
  }

  if (req.method === 'POST') {
    console.log("MENSAJE:", req.body);
    return res.status(200).send("ok");
  }

  return res.status(200).send("ok");
};

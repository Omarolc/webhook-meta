module.exports = async function (req, res) {
  try {
    // =========================
    // 🔐 VERIFICACIÓN META (GET)
    // =========================
    if (req.method === "GET") {
      const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ WEBHOOK VERIFICADO");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }

    // =========================
    // 📩 RECEPCIÓN MENSAJES (POST)
    // =========================
    if (req.method === "POST") {
      const body = req.body;

      const message =
        body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!message || !message.text) {
        return res.sendStatus(200);
      }

      const texto = message.text.body.trim();
      const from = message.from;

      console.log("📩 MENSAJE:", texto);

      const regex = /^\d{

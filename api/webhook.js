module.exports = async function (req, res) {
  console.log("🔥 WEBHOOK ACTIVO 🔥");

  // 👉 prueba rápida
  if (req.method === "GET") {
    return res.status(200).send("ok");
  }

  // 👉 POST (WhatsApp)
  if (req.method === "POST") {
    try {
      const body = req.body;

      console.log("📩 BODY:", JSON.stringify(body));

      return res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      console.error("❌ ERROR:", error);
      return res.status(500).send("error");
    }
  }

  return res.status(405).send("Method Not Allowed");
};

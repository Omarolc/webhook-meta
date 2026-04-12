export default async function handler(req, res) {
  const VERIFY_TOKEN = "ACR123";

  try {
    // 🔹 VERIFICACIÓN META
    if (req.method === "GET") {
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.status(403).send("Error de verificación");
      }
    }

    // 🔹 MENSAJES ENTRANTES
    if (req.method === "POST") {
      const body = req.body;

      console.log("BODY:", JSON.stringify(body));

      const message =
        body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {
        const from = message.from;

        console.log("Mensaje de:", from);

        await fetch(
          "https://graph.facebook.com/v18.0/1075972065598074/messages",
          {
            method: "POST",
            headers: {
              Authorization: Bearer EAASGMfpSvMQBRN8IiSr3DIElZA4hb7qZCyxSnhIp0ruYu1OXcqrC7MvFfz3XJU5SYjHvhkdyn9JYpZBOEAeN424uhSuDJJmwZBNPvLIodqmDJYlHgTDs6sP3vtfcD2r9cwt1LnWgqLqjeorlhzW6CLbL2ca7FFdRQD1oKTmf8Jiws5FuqSPS0HZABMyfmEBidxoeyTT1o1sZAlKzqipPZAYkGdBluZCdzBBkaUFLBVlxc7bQsHKPP8ZBNwpA8g8yRoaQ7SxrDDIjL5oZBt1kZBVDlLgpZAvidgZDZD,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              text: { body: "🔥 Bot funcionando" },
            }),
          }
        );
      }

      return res.status(200).send("EVENT_RECEIVED");
    }

    return res.status(405).send("Método no permitido");
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(200).send("OK"); // 🔥 evita que Meta rompa
  }
}

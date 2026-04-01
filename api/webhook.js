module.exports = async function handler(req, res) {
  // === VALIDAR VARIABLES DE ENTORNO ===
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const PHONE_NUMBER_ID = process.env.NUMERO_DE_TELEFONO_ID;
  const ACCESS_TOKEN = process.env.TOKEN_DE_WHATSAPP;

  if (!VERIFY_TOKEN || !PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.error("❌ Faltan variables de entorno requeridas");
    return res.status(500).json({ error: "Configuración incompleta del servidor" });
  }

  // ===== VERIFICACIÓN (GET) =====
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

  // ===== MENSAJES (POST) =====
  if (req.method === "POST") {
    try {
      const body = req.body;
      console.log("📩 Webhook recibido:", JSON.stringify(body, null, 2));

      // Extraer los mensajes de la estructura de Meta
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          const messages = value?.messages || [];

          // Procesar cada mensaje individualmente
          for (const message of messages) {
            await processMessage(message, PHONE_NUMBER_ID, ACCESS_TOKEN);
          }
        }
      }

      // Siempre responder 200 a Meta para confirmar recepción
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("💥 Error fatal en el webhook:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Método no permitido
  return res.status(405).send("Método no permitido");
};

/**
 * Procesa un mensaje individual de WhatsApp
 */
async function processMessage(message, phoneNumberId, accessToken) {
  try {
    // Verificar que sea un mensaje de texto
    if (message.type !== "text") {
      console.log(`⏩ Mensaje tipo ${message.type} ignorado (no es texto)`);
      return;
    }

    const from = message.from;
    const messageId = message.id;

    // Opcional: evitar duplicados en memoria (idealmente usar Redis o DB)
    if (processedMessages.has(messageId)) {
      console.log(`♻️ Mensaje duplicado ignorado: ${messageId}`);
      return;
    }
    processedMessages.add(messageId);
    // Limitar tamaño del Set para no crecer indefinidamente
    if (processedMessages.size > 1000) {
      const first = processedMessages.values().next().value;
      processedMessages.delete(first);
    }

    // Texto recibido (por si queremos personalizar la respuesta)
    const receivedText = message.text?.body || "";

    console.log(`✉️ Mensaje de ${from}: "${receivedText}"`);

    // Enviar respuesta automática
    await sendWhatsAppMessage(from, "Ya quedó 🔥", phoneNumberId, accessToken);
  } catch (error) {
    console.error(`❌ Error procesando mensaje ${message.id}:`, error);
    // No lanzamos el error para que el webhook no falle para otros mensajes
  }
}

/**
 * Envía un mensaje de texto a través de la API de WhatsApp
 */
async function sendWhatsAppMessage(to, text, phoneNumberId, accessToken) {
  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      text: { body: text },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error de WhatsApp API: ${response.status} - ${JSON.stringify(data)}`);
  }

  console.log(`✅ Mensaje enviado a ${to}:`, data);
  return data;
}

// Set simple en memoria para evitar duplicados (solo útil si el webhook se ejecuta en una sola instancia)
// Para producción con múltiples instancias, usar Redis o similar.
const processedMessages = new Set();

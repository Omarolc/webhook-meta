// /api/webhook.js (Pages Router) o /app/api/webhook/route.js (App Router)
// Asegúrate de adaptar la exportación según tu versión de Next.js.

// ============================================================
// 1. VALIDACIÓN DE VARIABLES DE ENTORNO (crítico)
// ============================================================
const REQUIRED_ENV = [
  'VERIFY_TOKEN',           // Tu token de verificación (el mismo que pones en Meta)
  'NUMERO_DE_TELEFONO_ID',  // ID del número de teléfono en WhatsApp Business
  'TOKEN_DE_WHATSAPP'       // Token de acceso permanente de WhatsApp
];

for (const envVar of REQUIRED_ENV) {
  if (!process.env[envVar]) {
    console.error(❌ FALTA VARIABLE DE ENTORNO: ${envVar});
    // No podemos lanzar error porque esto se ejecuta en cada invocación,
    // pero al menos lo registramos. Si falta alguna, la función fallará después.
  }
}

// ============================================================
// 2. MANEJADOR PRINCIPAL (compatible con Pages y App Router)
// ============================================================
export default async function handler(req, res) {
  // Variables de entorno (extraídas aquí para que no fallen por scope)
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const PHONE_NUMBER_ID = process.env.NUMERO_DE_TELEFONO_ID;
  const ACCESS_TOKEN = process.env.TOKEN_DE_WHATSAPP;

  // ========== VERIFICACIÓN (GET) ==========
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente');
      return res.status(200).send(challenge);
    } else {
      console.warn('❌ Fallo verificación:', { mode, token, expected: VERIFY_TOKEN });
      return res.status(403).send('Error de verificación');
    }
  }

  // ========== MENSAJES (POST) ==========
  if (req.method === 'POST') {
    // Responder siempre 200 a Meta lo antes posible (evita reintentos)
    // Pero necesitamos procesar de forma asíncrona sin bloquear la respuesta.
    // Para ello, usamos un manejador asíncrono que no afecte el retorno.
    const responsePromise = handleWebhook(req.body, PHONE_NUMBER_ID, ACCESS_TOKEN);

    // En Next.js Pages Router, podemos responder inmediatamente y dejar que la promesa continúe.
    // En App Router, debemos usar waitUntil o similar, pero aquí asumimos Pages Router.
    res.status(200).json({ ok: true });

    // Procesar el webhook en segundo plano (no esperamos)
    responsePromise.catch(err => {
      console.error('💥 Error en procesamiento asíncrono:', err);
    });
  } else {
    // Método no permitido
    res.status(405).send('Método no permitido');
  }
}

// ============================================================
// 3. PROCESAMIENTO ASÍNCRONO DEL WEBHOOK
// ============================================================
async function handleWebhook(body, phoneNumberId, accessToken) {
  try {
    console.log('📩 Webhook recibido:', JSON.stringify(body, null, 2));

    // Validación estructural del payload (evita errores si Meta envía algo distinto)
    if (!body || typeof body !== 'object') {
      console.warn('⚠️ Payload inválido');
      return;
    }

    const entries = body.entry || [];
    if (entries.length === 0) {
      console.log('ℹ️ Webhook sin entries (puede ser un evento de estado)');
      return;
    }

    // Procesar cada entry y cada mensaje
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        const messages = value.messages;
        if (!messages || !Array.isArray(messages)) {
          // Puede ser un evento de actualización de estado (entregado, leído, etc.)
          console.log('ℹ️ Evento sin mensajes (status update)');
          continue;
        }

        // Procesar cada mensaje individualmente
        for (const message of messages) {
          await processMessage(message, phoneNumberId, accessToken);
        }
      }
    }
  } catch (error) {
    // Cualquier error aquí ya se logueará, pero no afecta la respuesta HTTP
    console.error('💥 Error en handleWebhook:', error);
  }
}

// ============================================================
// 4. PROCESAR UN MENSAJE INDIVIDUAL
// ============================================================
async function processMessage(message, phoneNumberId, accessToken) {
  try {
    // Verificar que el mensaje tenga el formato esperado
    if (!message || typeof message !== 'object') {
      console.warn('⚠️ Mensaje inválido');
      return;
    }

    // Solo procesar mensajes de texto (ignorar imágenes, ubicaciones, etc.)
    if (message.type !== 'text') {
      console.log(⏩ Mensaje tipo ${message.type} ignorado);
      return;
    }

    const from = message.from;
    const messageId = message.id;
    const receivedText = message.text?.body || '';

    // Evitar duplicados con un Set simple (opcional, para desarrollo)
    // En producción con múltiples instancias, mejor usar Redis o similar.
    if (processedIds.has(messageId)) {
      console.log(♻️ Mensaje duplicado ignorado: ${messageId});
      return;
    }
    processedIds.add(messageId);
    // Limitar el tamaño del Set para no llenar la memoria
    if (processedIds.size > 1000) {
      const first = processedIds.values().next().value;
      processedIds.delete(first);
    }

    console.log(✉️ Mensaje de ${from}: "${receivedText}");

    // Enviar respuesta automática
    await sendWhatsAppMessage(from, 'Ya quedó 🔥', phoneNumberId, accessToken);
  } catch (error) {
    console.error(❌ Error procesando mensaje ${message?.id}:, error);
  }
}

// ============================================================
// 5. ENVIAR MENSAJE A WHATSAPP (API META)
// ============================================================
async function sendWhatsAppMessage(to, text, phoneNumberId, accessToken) {
  // Validar que tengamos todos los datos necesarios
  if (!phoneNumberId || !accessToken) {
    throw new Error('Faltan credenciales de WhatsApp');
  }

  const url = https://graph.facebook.com/v18.0/${phoneNumberId}/messages;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: Bearer ${accessToken},
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      text: { body: text },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Lanzar error con detalles para que aparezca en los logs
    throw new Error(WhatsApp API error (${response.status}): ${JSON.stringify(data)});
  }

  console.log(✅ Mensaje enviado a ${to}:, data);
  return data;
}

// Set simple para evitar duplicados (en memoria, solo útil para una instancia)
const processedIds = new Set();

const express = require('express');
const fetch = require('node-fetch'); // Solo si usas Node < 18
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Ruta para recibir llamadas desde Twilio
app.post('/zobrino-hook', async (req, res) => {
  const { CallSid, From, To, RecordingUrl } = req.body;

  console.log('🔔 Twilio envió una llamada:');
  console.log('CallSid:', CallSid);
  console.log('From:', From);
  console.log('To:', To);
  console.log('RecordingUrl:', RecordingUrl);

  try {
    const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/XXXXXXXX/XXXXXXXX', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CallSid, From, To, RecordingUrl })
    });

    const result = await zapierResponse.text();
    console.log('✅ Enviado a Zapier:', result);
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error al enviar a Zapier:', error);
    res.status(500).send('Error al reenviar a Zapier');
  }
});

// Ruta base (opcional)
app.get('/', (req, res) => {
  res.send('Zobrino backend en vivo');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`ZOBRINO ESCUCHANDO EN PUERTO ${PORT}`);
});

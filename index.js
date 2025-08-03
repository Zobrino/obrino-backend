const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// Ruta existente para subida de audio desde Zapier
app.post('/upload-audio', (req, res) => {
  const { filename, audio_base64 } = req.body;

  if (!filename || !audio_base64) {
    return res.status(400).json({ error: '❌ Missing filename or audio_base64' });
  }

  const audioBuffer = Buffer.from(audio_base64, 'base64');
  const filePath = path.join(__dirname, 'public/audio', filename);

  fs.writeFile(filePath, audioBuffer, (err) => {
    if (err) {
      console.error('❌ Error guardando archivo:', err);
      return res.status(500).json({ error: '❌ Failed to save audio file' });
    }

    const publicUrl = `${req.protocol}://${req.get('host')}/audio/${filename}`;
    res.status(200).json({ url: publicUrl });
  });
});

// 🚨 NUEVA RUTA PARA TWILIO
app.post('/zobrino-hook', (req, res) => {
  console.log('✅ Llamada recibida desde Twilio');
  console.log('🧾 Datos:', req.body);

  res.status(200).send('✅ Señal recibida correctamente');
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 ZOBRINO ESCUCHANDO EN PUERTO ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./ubicaciones.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Web Push setup
const publicVapidKey = "BPaW76e491m4ebBJFa2s5aswfKU6jhSoVFDsAV_z0cbFFe5uGinqGn9PC15ZG7iQ6kopIZ3u4rnUCRqrkcXm3wc";
const privateVapidKey = "-HOhVaQD_VkcLgdT3GHGd6luMPP0RdBfbLZ6aCMl80s";
webpush.setVapidDetails('mailto:lcao2018@udec.cl', publicVapidKey, privateVapidKey);

let subscriptions = [];

// Base de datos
db.run(`CREATE TABLE IF NOT EXISTS ubicaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitud REAL,
  longitud REAL,
  ciudad TEXT
);`);

// Endpoints
app.post('/subscribe', (req, res) => {
  subscriptions.push(req.body);
  console.log('📬 Nueva suscripción push');
  res.status(201).json({ message: 'Subscribed!' });
});

app.post('/guardar_ubicacion', (req, res) => {
  const { latitud, longitud, ciudad } = req.body;
  const sql = 'INSERT INTO ubicaciones (latitud, longitud, ciudad) VALUES (?, ?, ?)';

  db.run(sql, [latitud, longitud, ciudad], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar la ubicación' });
    }
    res.send(`Ubicación guardada: ${ciudad}, Lat: ${latitud}, Lon: ${longitud}`);
  });
});

app.post('/clima', async (req, res) => {
  const { lat, lon } = req.body;
  const apiKey = '3c780b370db3868a80f217cda22a105e';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const { data } = await axios.get(url);
    res.json({
      temperatura: data.main.temp,
      viento: data.wind.speed,
      tiempo_id: data.weather[0].id,
      descripcion: data.weather[0].description,
      ciudad: data.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
});

app.post('/clima_por_ciudad', async (req, res) => {
  const { ciudad } = req.body;
  const apiKey = '3c780b370db3868a80f217cda22a105e';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const { data } = await axios.get(url);
    res.json({
      temperatura: data.main.temp,
      viento: data.wind.speed,
      tiempo_id: data.weather[0].id,
      descripcion: data.weather[0].description,
      ciudad: data.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el clima para esa ciudad' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ success: email === 'admin@admin.com' && password === '123456' });
});

// 🔍 Nuevo endpoint para obtener actividades recomendadas
app.post('/recomendar', (req, res) => {
  const { temperatura, viento, tiempo_id, preferencias } = req.body;

  const actividades = [
    { nombre: 'Leer un libro', categoria: 'relajación', exterior: false, lluvia: true },
    { nombre: 'Correr en el parque', categoria: 'ejercicio', exterior: true, lluvia: false },
    { nombre: 'Ver una película', categoria: 'ocio', exterior: false, lluvia: true },
    { nombre: 'Andar en bicicleta', categoria: 'ejercicio', exterior: true, lluvia: false },
    { nombre: 'Meditar', categoria: 'relajación', exterior: false, lluvia: true }
  ];

  const llueve = tiempo_id >= 200 && tiempo_id < 700;
  const vientoFuerte = viento > 10;

  const recomendadas = actividades.filter(a => {
    const coincide = preferencias[a.categoria] > 0;
    const no_lluvia = !a.exterior || !llueve;
    const no_viento = !a.exterior || !vientoFuerte;
    return coincide && no_lluvia && no_viento;
  });

  res.json({ actividades: recomendadas });
});

// ⏰ Envío de notificaciones periódicas
setInterval(() => {
  const message = {
    title: '⏰ Recordatorio',
    body: 'Esta es una notificación push automática del servidor.'
  };
  sendToAll(message);
}, 30000);

// 🔧 Enviar a todos los subscriptores
async function sendToAll(message) {
  const payload = JSON.stringify(message);
  await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        console.error('Error al enviar push:', err);
      })
    )
  );
}

app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});


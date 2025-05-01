const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./ubicaciones.db');

db.run(`CREATE TABLE IF NOT EXISTS ubicaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitud REAL,
  longitud REAL,
  ciudad TEXT
)`);

app.post('/guardar_ubicacion', (req, res) => {
  const { latitud, longitud, ciudad } = req.body;
  db.run('INSERT INTO ubicaciones (latitud, longitud, ciudad) VALUES (?, ?, ?)', [latitud, longitud, ciudad]);
  res.send(`Ubicación guardada: ${ciudad}, Latitud: ${latitud}, Longitud: ${longitud}`);
});

app.post('/clima', async (req, res) => {
  const { lat, lon } = req.body;
  const apiKey = '602ffc6533393af7fca7c9855fbbd712';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const respuesta = await axios.get(url);
    const datos = respuesta.data;

    //console.log(datos);

    res.json({
      temperatura: datos.main.temp,
      viento: datos.wind.speed,
      tiempo_id: datos.weather[0].id,
      descripcion: datos.weather[0].description,
      ciudad: datos.name
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el clima' });
  }
});


app.post('/clima_por_ciudad', async (req, res) => {
  const { ciudad } = req.body;
  const apiKey = '602ffc6533393af7fca7c9855fbbd712';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const respuesta = await axios.get(url);
    const datos = respuesta.data;
    res.json({
      temperatura: datos.main.temp,
      descripcion: datos.weather[0].description,
      ciudad: datos.name
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el clima para esa ciudad' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validación simple (luego puedes conectar esto con la base de datos)
  if (email === 'admin@admin.com' && password === '123456') {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

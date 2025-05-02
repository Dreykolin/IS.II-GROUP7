const express = require('express');
const cors = require('cors');
const axios = require('axios');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./base_de_datos.db');  // Acá creamos nuestra base de datos

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Web Push setup
const publicVapidKey = "BPaW76e491m4ebBJFa2s5aswfKU6jhSoVFDsAV_z0cbFFe5uGinqGn9PC15ZG7iQ6kopIZ3u4rnUCRqrkcXm3wc";
const privateVapidKey = "-HOhVaQD_VkcLgdT3GHGd6luMPP0RdBfbLZ6aCMl80s";
webpush.setVapidDetails('mailto:lcao2018@udec.cl', publicVapidKey, privateVapidKey);

let subscriptions = [];






// TABLAS
db.run(`CREATE TABLE IF NOT EXISTS ubicaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitud REAL,
  longitud REAL,
  ciudad TEXT
);`);

db.run(`CREATE TABLE IF NOT EXISTS actividades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  descripcion TEXT,
  temperatura REAL,
  viento REAL,
  lluvia REAL,
  uv REAL,
  outdoor REAL,
  indoor REAL,
  intellectual REAL,
  sports REAL,
  usuario_id INTEGER,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);`);

db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  contraseña TEXT
);`);






// Endpoints
app.post('/subscribe', (req, res) => {
  subscriptions.push(req.body);
  console.log('📬 Nueva suscripción push');
  res.status(201).json({ message: 'Subscribed!' });
});



app.post('/guardar_usuario', (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).send('Email y contraseña son obligatorios');
  }

  const sql = 'INSERT INTO usuarios (email, contraseña) VALUES (?, ?)';
  db.run(sql, [email, contraseña], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al guardar el usuario');
    }
    res.send('Usuario guardado correctamente');
  });
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



app.post('/guardar_actividad', (req, res) => {
  const { nombre, descripcion, temperatura, viento, lluvia, uv, outdoor, indoor, intellectual, sports, usuario_id } = req.body;

  const sql = `
    INSERT INTO actividades 
    (nombre, descripcion, temperatura, viento, lluvia, uv, outdoor, indoor, intellectual, sports, usuario_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [nombre, descripcion, temperatura, viento, lluvia, uv, outdoor, indoor, intellectual, sports, usuario_id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al guardar la actividad' });
    }
    res.send(`Actividad guardada: ${nombre}`);
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

  // Consulta SQL para verificar el usuario y la contraseña
  const query = 'SELECT * FROM usuarios WHERE email = ? AND contraseña = ?';

  db.get(query, [email, password], (err, row) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err.message);
      return res.status(500).json({ success: false, message: 'Error en la base de datos' });
    }

    if (row) {
      // Si el usuario existe, devolvemos su ID también
      res.json({ 
        success: true, 
        message: 'Inicio de sesión exitoso', 
        usuario_id: row.id, 
        nombre: row.nombre // opcional, si lo necesitas
      });
    } else {
      res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  });
});




// 🔍 Nuevo endpoint para obtener actividades recomendadas
app.post('/recomendar', (req, res) => {
  const { temperatura, viento, tiempo_id, preferencias } = req.body;

  const actividades = [
    {nombre: "Ciclismo", descripcion: "Salir en bicicleta al parque", temperatura: 22, viento: 10, lluvia: 0, uv: 1, outdoor: 4, indoor: 1, intellectual: 1, sports: 3},
    {nombre: "Picnic", descripcion: "Picnic con amigos", temperatura: 25, viento: 8, lluvia: 0, uv: 1, outdoor: 3, indoor: 1, intellectual: 1, sports: 1},
    {nombre: "Senderismo", descripcion: "Subida en el cerro", temperatura: 18, viento: 12, lluvia: 0, uv: 1, outdoor: 4, indoor: 1, intellectual: 1, sports: 3},
    {nombre: "Lectura en balcón", descripcion: "Leer en el balcón", temperatura: 20, viento: 5, lluvia: 0, uv: 7, outdoor: 2, indoor: 5, intellectual: 5, sports: 1},
    {nombre: "Lectura junto al fuego", descripcion: "Leer en la casa", temperatura: 10, viento: 7, lluvia: 0, uv: 7, outdoor: 1, indoor: 4, intellectual: 5, sports: 1},
    {nombre: "Fútbol", descripcion: "Jugar fútbol con amigos", temperatura: 24, viento: 9, lluvia: 0, uv: 1, outdoor: 3, indoor: 1, intellectual: 1, sports: 4},

    /*
    { nombre: 'Leer un libro', categoria: 'relajación', exterior: false, lluvia: true },
    { nombre: 'Correr en el parque', categoria: 'ejercicio', exterior: true, lluvia: false },
    { nombre: 'Ver una película', categoria: 'ocio', exterior: false, lluvia: true },
    { nombre: 'Andar en bicicleta', categoria: 'ejercicio', exterior: true, lluvia: false },
    { nombre: 'Meditar', categoria: 'relajación', exterior: false, lluvia: true }
     */
  ];

  const llueve = tiempo_id >= 200 && tiempo_id < 700;
  const vientoFuerte = viento > 10;


  const filteredActivities = actividades.filter(activity => {
    return (
      activity.outdoor <= preferencias.outdoor &&
      activity.indoor <= preferencias.indoor &&
      activity.intellectual <= preferencias.intellectual &&
      activity.sports <= preferencias.sports &&
      temperatura >= activity.temperatura - 10 &&
      temperatura <= activity.temperatura + 10 &&
      viento <= activity.viento + 10

      
    );
  });

  /*
  const recomendadas = actividades.filter(a => {
    const coincide = preferencias[a.categoria] > 0;
    const no_lluvia = !a.exterior || !llueve;
    const no_viento = !a.exterior || !vientoFuerte;
    return coincide && no_lluvia && no_viento;
  });
  */
  res.json({ actividades: filteredActivities });
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






app.get('/actividades/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const query = `SELECT * FROM actividades WHERE usuario_id = ?`;

  db.all(query, [usuario_id], (err, rows) => {
    if (err) {
      console.error('Error al obtener actividades:', err.message);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.json(rows); // Devuelve todas las actividades del usuario
  });
});




app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});


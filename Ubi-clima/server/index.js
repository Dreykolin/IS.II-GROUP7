const express = require('express');
const cors = require('cors');
const axios = require('axios');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./base_de_datos.db');  // Acá creamos nuestra base de datos
const Tables = require('./models/tables');
const apiKey_Weather = '8c602967b810f8b7f537a67aaeaef81d';

Tables(db);
//XD

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Web Push setup
const publicVapidKey = "BPaW76e491m4ebBJFa2s5aswfKU6jhSoVFDsAV_z0cbFFe5uGinqGn9PC15ZG7iQ6kopIZ3u4rnUCRqrkcXm3wc";
const privateVapidKey = "-HOhVaQD_VkcLgdT3GHGd6luMPP0RdBfbLZ6aCMl80s";
webpush.setVapidDetails('mailto:lcao2018@udec.cl', publicVapidKey, privateVapidKey);

let subscriptions = []; //Curioso digamos







// Endpoints










//usado para registrar un usuario en la base de datos
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


//Actualmente tenemos una tabla de ubicaciones eb la bdd, tocará ver si realmente es útil, pero el tema es que se guardan co esto.
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


//El más importante. Permite que el usuario guarde sus actividades.
//también está programado para que si se añade una actividad sin user id, este esté disponible para todos (como modo predeterminado)
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
});app.post('/guardar_recomendacion', (req, res) => {
  const { nombre, descripcion, temperatura, viento, lluvia, uv } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const valores = [
    nombre,
    descripcion,
    temperatura ?? null,
    viento ?? null,
    lluvia ?? null,
    uv ?? null,
    0, 0, 0, 0,
    null
  ];

  console.log('Valores a insertar:', valores);

  const sql = `
    INSERT INTO actividades 
    (nombre, descripcion, temperatura, viento, lluvia, uv, outdoor, indoor, intellectual, sports, usuario_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, valores, function(err) {
    if (err) {
      console.error('Error al guardar la recomendación:', err);  // muestra el error completo
      return res.status(500).json({ error: 'Error al guardar la recomendación' });
    }
    res.send(`Recomendación guardada: ${nombre}`);
  });
});
app.post('/actividades', (req, res) => {
  const {
    nombre, descripcion, temperatura, viento, lluvia, uv,
    outdoor, indoor, sports, intellectual, usuario_id
  } = req.body;

  db.run(
    `INSERT INTO actividades (nombre, descripcion, temperatura, viento, lluvia, uv, outdoor, indoor, sports, intellectual, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, temperatura, viento, lluvia, uv, outdoor, indoor, sports, intellectual, usuario_id],
    function (err) {
      if (err) {
        console.error("Error al insertar actividad:", err.message);
        return res.status(500).json({ error: 'Error al guardar actividad' });
      }
      res.status(200).json({ mensaje: 'Actividad guardada correctamente', id: this.lastID });
    }
  );
});

app.get('/usuarios', (req, res) => {
  const sql = 'SELECT id, email FROM usuarios';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
    res.json(rows);
  });
});















//Esto no guarda en una base de datos, esto solo captura el clima en base a la latencia y longitud, usada para 
//tener el clima de tu ciudad actual
app.post('/clima', async (req, res) => {
  const { lat, lon } = req.body;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey_Weather}&units=metric&lang=es`;

  try {
    const { data } = await axios.get(url);
    res.json({
      temperatura: data.main.temp,
      humedad: data.main.humidity,
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



//Si quieres añadir una ciudad, se usa este, que hace lo mismo que el anterior, pero en base al nombre de la ciudad
app.post('/clima_por_ciudad', async (req, res) => {
  const { ciudad } = req.body;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey_Weather}&units=metric&lang=es`;

  try {
    const { data } = await axios.get(url);
    res.json({
      temperatura: data.main.temp,
      humedad: data.main.humidity,
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



app.post('/pronostico', async (req, res) => {
    const { lat, lon } = req.body;
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey_Weather}&units=metric&lang=es`;

    try {
        const { data } = await axios.get(url);

        const resumenDiario = data.daily.slice(0, 4).map(day => {
    
            const fecha = new Date(day.dt * 1000).toLocaleDateString('es-ES');
            const maxTemp = day.temp.max;
            const minTemp = day.temp.min;
            const descripcion = day.weather[0].description;
            const icono = day.weather[0].icon;

            return {
                fecha,
                temp_max: maxTemp.toFixed(1),
                temp_min: minTemp.toFixed(1),
                descripcion,
                icono,
            };
        });

        res.json({
            ciudad: data.timezone,
            resumenDiario 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el pronóstico' });
    }
});







//Este endopint captura el email y la comtraseña que introduzcamos y lo busca en la base de datos, si todo sale bien, se loguea
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













// No tengo idea de este, peeeero es correcto que el backend maneje las recomendaciones y no el front
// RE: estas actividades son las recomendadas por desarrolladores. lo ideal sería entregarselas a la db, pero por ahora están acá.
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
  res.json({ actividades: filteredActivities });
});







//Usado por las notificaciones en 2do plano
app.post('/subscribe', (req, res) => {
  subscriptions.push(req.body);
  console.log('📬 Nueva suscripción push');
  res.status(201).json({ message: 'Subscribed!' });
});

//Otro que no tengo idea, seguro es de la linna porque es lo que lanzaba la notificación
// ⏰ Envío de notificaciones periódicas
setInterval(() => {
  const message = {
    title: 'Clima de hoy en ubicación',
    body: 'temperatura: ,actividad recomenddo: salir a caminar.'
  };
  sendToAll(message);
}, 30000);

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



//El modo Admin, esto NO es posible según yo, usuario id es una clave primaria
app.get('/admin', (req, res) => {
  const query = `SELECT * FROM actividades WHERE usuario_id IS NULL`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener actividades del admin:', err.message);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json(rows);
  });
});


//Esto es lo que permite obtener las actividades del usuario que anteriormente fueron registradas en la base de datos,.
app.get('/actividades/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const query = `SELECT * FROM actividades WHERE usuario_id = ?`;

  db.all(query, [usuario_id], (err, rows) => {
    if (err) {
      console.error('Error al obtener actividades:', err.message);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    res.json(rows);
  });
});



app.post('/registrar_actividad', (req, res) => {
  const { usuario_id, actividad_id } = req.body;

  if (!usuario_id || !actividad_id) {
    return res.status(400).json({ error: 'Faltan datos: usuario_id y actividad_id son obligatorios' });
  }

  const sql = `
    INSERT INTO historial_actividades (usuario_id, actividad_id)
    VALUES (?, ?)
  `;

  db.run(sql, [usuario_id, actividad_id], function(err) {
    if (err) {
      console.error('Error al guardar en historial:', err.message);
      return res.status(500).json({ error: 'Error al registrar actividad' });
    }
    res.json({ success: true, message: 'Actividad registrada en historial' });
  });
});

app.get('/historial/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const { mes, año } = req.query;

  let sql = `
    SELECT ha.fecha, a.nombre, a.descripcion
    FROM historial_actividades ha
    JOIN actividades a ON ha.actividad_id = a.id
    WHERE ha.usuario_id = ?
  `;
  const params = [usuario_id];

  if (mes && año) {
    sql += ` AND strftime('%m', ha.fecha) = ? AND strftime('%Y', ha.fecha) = ?`;
    params.push(mes.padStart(2, '0'), año);
  }

  sql += ` ORDER BY ha.fecha DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error al obtener historial:', err.message);
      return res.status(500).json({ error: 'Error al obtener historial' });
    }
    res.json(rows);
  });
});

//Este es para guardar los gustos del usuario
app.post('/api/guardar-preferencia', (req, res) => {
  const { usuario_id, categoria, valor } = req.body;

  if (!usuario_id || !categoria || typeof valor !== 'number') {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  // Validar que la categoría sea válida (evita inyecciones SQL)
  const categoriasValidas = ['outdoor', 'indoor', 'intellectual', 'sports'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría inválida' });
  }

  // Verificar si ya existen preferencias
  db.get('SELECT * FROM gustos WHERE usuario_id = ?', [usuario_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      // Actualiza solo esa columna
      const query = `UPDATE gustos SET ${categoria} = ? WHERE usuario_id = ?`;
      db.run(query, [valor, usuario_id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Preferencia actualizada' });
      });
    } else {
      // Crea una fila con valores nulos excepto la categoría actual
      const nuevoRegistro = {
        usuario_id,
        outdoor: null,
        indoor: null,
        intellectual: null,
        sports: null,
        [categoria]: valor,
      };
      db.run(
        `INSERT INTO gustos (usuario_id, outdoor, indoor, intellectual, sports)
         VALUES (?, ?, ?, ?, ?)`,
        [
          nuevoRegistro.usuario_id,
          nuevoRegistro.outdoor,
          nuevoRegistro.indoor,
          nuevoRegistro.intellectual,
          nuevoRegistro.sports,
        ],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          return res.json({ message: 'Preferencia creada' });
        }
      );
    }
  });
});



//Solo es un flag
app.listen(3000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});


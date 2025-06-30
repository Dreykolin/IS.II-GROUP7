
// TABLAS
module.exports = function Tables(db) {
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
  contraseña TEXT,
  tour_completado INTEGER DEFAULT 0 NOT NULL 
);
`);

db.run(`
  CREATE TABLE IF NOT EXISTS historial_actividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    actividad_id INTEGER,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(actividad_id) REFERENCES actividades(id)
  )
`);

};

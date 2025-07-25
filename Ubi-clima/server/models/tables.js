
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
      fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
      tours_vistos TEXT NOT NULL DEFAULT '{"home": false, "historial": false, "actividades": false, "ajustes": false, "administrador": false, "preferencias_configuradas": false}',
      outdoor INTEGER DEFAULT 3,
      indoor INTEGER DEFAULT 3,
      sports INTEGER DEFAULT 3,
      intellectual INTEGER DEFAULT 3
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

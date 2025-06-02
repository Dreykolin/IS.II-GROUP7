import { useState, useEffect } from 'react';



const PreferenceSelector = () => {
  const [user_preferences, setPreferences] = useState({
    outdoor: 3,
    indoor: 3,
    sports: 3,
    intellectual: 3
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const nuevoValor = Number(value);

    // Actualiza el estado local
    setPreferences(prev => ({ ...prev, [name]: nuevoValor }));

    // Suponemos que tienes acceso al ID del usuario
    const usuario_id = obtenerIDDesdeToken(); // Puedes extraerlo del JWT

    // Enviar al backend
    try {
      await fetch('/api/guardar-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario_id,
          categoria: name,      // ej: "outdoor"
          valor: nuevoValor     // ej: 4
        })
      });
    } catch (error) {
      console.error('Error al guardar preferencia:', error);
    }
  };

  return (
    <div>
      <h1>Define tus gustos</h1>
      <p>Del 1 al 5, califica las siguientes categorías según cuánto te gustan.</p>
      {Object.entries(user_preferences).map(([key, value]) => (
        <div key={key}>
          <p>{key}</p>
          <input
            type="range"
            min="1"
            max="5"
            name={key}
            value={value}
            onChange={handleChange}
          />
          <p>Valor: {value}</p>
        </div>
      ))}
    </div>
  );
};

export default function Ajustes() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUsuarioAutenticado(!!token);
  }, []);
  /*
  Por ahora está solo la estructura visual.
  Para jugar con esto, hay que hacer una base de datos
  y antes de una base de datos, hay que ahcer un MER  
  */
  if (!usuarioAutenticado) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h2>Para acceder a los ajustes, necesitas iniciar sesión</h2>  
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <PreferenceSelector />
      <h2 className="mb-4">Ajustes</h2>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Cuenta</h5>
          <p className="card-text">Cambiar correo electrónico, contraseña u otros datos personales.</p>
          <button className="btn btn-outline-primary">Editar cuenta</button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">	
          <h5 className="card-title">Notificaciones</h5>
          <p className="card-text">Configura cómo y cuándo deseas recibir notificaciones.</p>
          <button className="btn btn-outline-secondary">Preferencias de notificación</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Privacidad</h5>
          <p className="card-text">Revisa y ajusta tus opciones de privacidad.</p>
          <button className="btn btn-outline-danger">Configuración de privacidad</button>
        </div>
      </div>
    </div>
  );
}



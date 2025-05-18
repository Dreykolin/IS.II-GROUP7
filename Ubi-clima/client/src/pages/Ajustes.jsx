import { useState, useEffect } from 'react';

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


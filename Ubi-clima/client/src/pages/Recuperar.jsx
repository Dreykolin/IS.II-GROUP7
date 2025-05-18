import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap





const Recuperar = () => {
  return (
    <div className="recover-container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow-sm rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-3">Recuperar Contraseña</h2>
        <p className="text-center text-muted mb-4">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Enviar Enlace
          </button>

          <div className="text-center">
            <a href="/index.html" className="text-decoration-none">Volver a Iniciar Sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recuperar;



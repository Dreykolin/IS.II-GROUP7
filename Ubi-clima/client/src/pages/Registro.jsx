import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const Registro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para el registro, por ejemplo, validaciones, enviar datos al servidor, etc.
    console.log('Formulario enviado:', formData);
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow-sm rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-3">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm-password" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirm-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Registrarse
          </button>

          <div className="text-center">
            <span>¿Ya tienes una cuenta?</span>
            <a href="/login" className="text-decoration-none">Inicia Sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;


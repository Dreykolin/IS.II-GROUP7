import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/guardar_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, contraseña: formData.password }),
      });

      const data = await response.text(); // tu endpoint responde con texto plano
      alert(data); // mostrar respuesta del backend
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow-sm rounded" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-3">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo de email */}
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

          {/* Contraseña */}
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

          {/* Confirmar contraseña */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botón */}
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Registrarse
          </button>

          {/* Link */}
          <div className="text-center">
            <span>¿Ya tienes una cuenta?</span>
            <a href="/login" className="text-decoration-none"> Inicia Sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;


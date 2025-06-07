import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAjustes() {
  const navigate = useNavigate();

  const salirDelModoAdmin = () => {
    navigate('/'); // o '/home' si tu ruta home se llama así
  };

  return (
    <div className="admin-ajustes">
      <h2>Configuración de Ajustes</h2>
      <p>Aquí puedes modificar las configuraciones del sistema.</p>
      <button onClick={salirDelModoAdmin} className="btn btn-primary mt-3">
        Volver al inicio
      </button>
    </div>
  );
}
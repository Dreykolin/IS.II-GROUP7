import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3000';

async function obtenerHistorial(usuario_id) {
  const res = await fetch(`${API_BASE}/historial/${usuario_id}`);
  if (!res.ok) throw new Error('Error al obtener historial');
  return await res.json();
}

function Historial({ usuarioId }) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerHistorial(usuarioId);
        setHistorial(data);
      } catch (error) {
        console.error(error);
      }
    }
    cargar();
  }, [usuarioId]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Historial de Actividades</h2>
      {historial.length === 0 ? (
        <p>No hay actividades registradas.</p>
      ) : (
        historial.map((item, index) => (
          <div key={index} className="border-b py-2">
            <div className="flex justify-between items-center">
              <strong>{item.nombre}</strong>
              <span className="text-sm text-gray-500">
                {new Date(item.fecha).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.descripcion}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Historial;

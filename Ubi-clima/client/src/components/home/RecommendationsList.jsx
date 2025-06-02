import { useState, useEffect } from 'react';
import { useClima } from '../../context/ClimaContext';

const RecommendationsList = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  const { datosClima } = useClima();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    setUsuarioAutenticado(!!token);
  }, []);

  // Cargar actividades del usuario
  useEffect(() => {
    const fetchActivities = async () => {
      const usuario_id = localStorage.getItem('usuario_id');
      if (!usuario_id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/actividades/${usuario_id}`);
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Función para agregar actividad al historial
  const handleAgregar = async (actividad_id) => {
    const usuario_id = localStorage.getItem('usuario_id');

    try {
      const res = await fetch(`http://localhost:3000/registrar_actividad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, actividad_id }),
      });

      if (!res.ok) throw new Error('Error en la respuesta del servidor');

      alert('Actividad registrada con éxito');
    } catch (err) {
      console.error('Error al registrar actividad:', err);
      alert('No se pudo registrar la actividad');
    }
  };

  if (isLoading || !datosClima) return <p>Cargando recomendaciones...</p>;

  // Filtro simple basado en temperatura
  const actividadesFiltradas = activities.filter((act) => {
    const tempIdeal = Number(act.temperatura);
    return (
      datosClima.temperatura >= tempIdeal - 3 &&
      datosClima.temperatura <= tempIdeal + 3
    );
  });

  return (
    <div>
      {actividadesFiltradas.length > 0 ? (
        <>
          <h2>De tus actividades favoritas, podrías hacer estas ahora.</h2>
          {actividadesFiltradas.map((actividad, index) => (
            <div key={index}>
              <h3>{actividad.nombre}</h3>
              <p>{actividad.descripcion}</p>
              <button onClick={() => handleAgregar(actividad.id)}>Agregar al historial</button>
            </div>
          ))}
        </>
      ) : (
        <p>Las condiciones de tus actividades no se cumplen por ahora ☹️</p>
      )}
    </div>
  );
};

export default RecommendationsList;

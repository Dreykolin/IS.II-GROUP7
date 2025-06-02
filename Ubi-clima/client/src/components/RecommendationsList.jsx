import React, { useState, useEffect } from 'react';

const RecommendationsList = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [datosClima, setDatosClima] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  // Cargar clima desde localStorage una sola vez
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUsuarioAutenticado(true);

      const cache = localStorage.getItem('datosClima');
      if (cache) {
        try {
          const datos = JSON.parse(cache);
          setDatosClima({
            descripcion: datos.descripcion ?? '',
            temperatura: datos.temperatura ?? null,
            ciudad: datos.ciudad ?? '',
            viento: datos.viento ?? null,
            tiempo_id: datos.tiempo_id ?? null
          });
        } catch (err) {
          console.error("❌ Error al leer datosClima:", err);
        }
      } else {
        console.warn("⚠️ No se encontró 'datosClima' en localStorage");
      }
    } else {
      setUsuarioAutenticado(false);
    }
  }, []);

  // Obtener actividades del usuario
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

  // Mostrar "cargando" si faltan datos
  if (isLoading || !datosClima) return <p>Cargando recomendaciones...</p>;

  // Filtrado basado en temperatura (podés expandirlo después con viento, lluvia, etc.)
  const actividadesFiltradas = (actividad) => {
    if (!actividad) return false;

    const tempIdeal = Number(actividad.temperatura);
    return (
      datosClima.temperatura >= tempIdeal - 3 &&
      datosClima.temperatura <= tempIdeal + 3
    );
  };

  const filtradas = activities.filter(act => actividadesFiltradas(act));

  return (
    <div>
      {filtradas.length > 0 ? (
        <>
          <h2>De tus actividades favoritas, podrías hacer estas ahora.</h2>
          {filtradas.map((actividad, index) => (
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

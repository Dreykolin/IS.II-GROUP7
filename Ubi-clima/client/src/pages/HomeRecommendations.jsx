import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/RecommendationsList.css';

const HomeRecommendations = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [datosClima, setDatosClima] = useState(null);
  const [ubicacionAutomatica, setUbicacionAutomatica] = useState('');
  const [climaAutomatico, setClimaAutomatico] = useState('');
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); // Estado para verificar si está autenticado
  const { isAuthenticated, user, markTourAsSeen } = useAuth();

  //Esto es un sucio copypaste para tener el clima y hacer el flitro de actividades
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUsuarioAutenticado(true);

      obtenerUbicacionAutomatica();
      

      // Establecer actualización periódica
      const intervalo = setInterval(() => {
        obtenerUbicacionAutomatica();
      }, 10 * 60 * 1000); // 10 minutos

      // Limpiar el intervalo cuando se desmonta el componente
      return () => clearInterval(intervalo);

    } else {
      setUsuarioAutenticado(false);
    }
  }, []);

  const obtenerUbicacionAutomatica = () => {
    console.log("Ejecutando obtenerUbicacionAutomatica...");
    if (!navigator.geolocation) {
      setUbicacionAutomatica("La geolocalización no es compatible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;

      try {
        const climaRes = await fetch('http://localhost:3000/clima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitud, lon: longitud })
        });

        const datosClima = await climaRes.json();
        setDatosClima(datosClima);

        const climaTexto = `Clima: ${datosClima.descripcion}, ${datosClima.temperatura}°C`;
        const ubicacionTexto = `Ciudad: ${datosClima.ciudad}`;

        setClimaAutomatico(climaTexto);
        setUbicacionAutomatica(ubicacionTexto);

        // Guardar en localStorage
        localStorage.setItem('clima', climaTexto);
        localStorage.setItem('ubicacion', ubicacionTexto);
      } catch (err) {
        console.error(err);
        setClimaAutomatico("Error al obtener clima.");
        setUbicacionAutomatica("");
      }
    });
  };
  //Aquí termina el sucio copypaste
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

  //De aquí se agarran las actividades
  useEffect(() => {
    const fetchActivities = async () => {
      const usuario_id = localStorage.getItem('usuario_id');
      
      if (!usuario_id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/actividades/${user.id}`);
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


  //Esta parte es puro filtrado de activiades
  console.log("datosClima:", datosClima);
  console.log("isLoading:", isLoading);
  if (isLoading || !datosClima) return <p>Cargando recomendaciones...</p>;

  const actividadesFiltradas = (actividad) => {
    if (!datosClima || !actividad) return false;

    const temp = Number(actividad.temperatura);

    return (
      (datosClima.temperatura >= temp - 3 && datosClima.temperatura <= temp+ 3) 
      //(!actividad.viento || datosClima.viento <= actividad.viento) &&
      //(actividad.lluvia == null || actividad.lluvia === 0 || datosClima.lluvia === false) &&
      //(!actividad.uv || datosClima.uv <= actividad.uv)
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


export default HomeRecommendations;
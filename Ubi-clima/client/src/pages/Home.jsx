import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";
import '../assets/home.css';

const ShortHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const usuario_id = localStorage.getItem('usuario_id');
      if (!usuario_id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/historial/${usuario_id}`);
        const data = await res.json();

        // ✅ Mostrar solo las 3 actividades más recientes
        setHistory(data.slice(0, 3));
      } catch (error) {
        console.error("Error al obtener historial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) return <p>Cargando historial...</p>;

  return (
    <div>
      {history.length > 0 ? (
        <>
          <h2>Tus últimas actividades</h2>
          {history.map((item, index) => (
            <div key={index}>
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <p><small>{new Date(item.fecha).toLocaleString()}</small></p>
            </div>
          ))}
        </>
      ) : (
        <p>No has hecho ninguna actividad aún.</p>
      )}
    </div>
  );
};

const RecommendationsList = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [datosClima, setDatosClima] = useState(null);
  const [ubicacionAutomatica, setUbicacionAutomatica] = useState('');
  const [climaAutomatico, setClimaAutomatico] = useState('');
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); // Estado para verificar si está autenticado

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
        const res = await fetch(`http://localhost:3000/actividades/${usuario_id}`);
        const data = await res.json();
        setActivities(data);;
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

function Home() {
  const [ubicacionAutomatica, setUbicacionAutomatica] = useState('');
  const [climaAutomatico, setClimaAutomatico] = useState('');
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); // Estado para verificar si está autenticado

  // Comprobar si el usuario tiene un token en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUsuarioAutenticado(true);

      // Cargar desde localStorage
      const ubicacionGuardada = localStorage.getItem('ubicacion');
      const climaGuardado = localStorage.getItem('clima');

      if (ubicacionGuardada && climaGuardado) {
        setUbicacionAutomatica(ubicacionGuardada);
        setClimaAutomatico(climaGuardado);
      } else {
        obtenerUbicacionAutomatica();
      }

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

  return (
    <div className="clima-page">
      {/* Si el usuario no está autenticado, mostramos el mensaje para iniciar sesión */}
      {!usuarioAutenticado ? (
        <>
          <div className="flex-container">
            <div className="alert alert-warning alerta-usuario">
              <h2>Para acceder a la aplicación, necesitas iniciar sesión</h2>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex-container">
            <div className="tarjeta-ciudad-container">
              <h1>Mi Ubicación Actual</h1>
              <TarjetaCiudad automatico={true} clima={climaAutomatico} ubicacion={ubicacionAutomatica} />
            </div>
            <div className="tarjeta-ciudad-container">
              <h1>Buscar otra Ciudad</h1>
              <TarjetaCiudad />
            </div>
          </div>
          
          <div className="flex-container">
            <RecommendationsList />
          </div>
          
          <div className="flex-container">
            <ShortHistory />
          </div>
        </>
      )}

      <header id="home" class="hero">
        <div class="hero-content">
          <h1>¡Descubre qué hacer hoy con el clima a tu favor!</h1>
          <p>Recomendaciones personalizadas para cada día, cada clima y cada persona.</p>
          <div class="hero-buttons">
            <a href="#activities" class="btn primary">Ver recomendaciones</a>
            <a href="#settings" class="btn secondary">Configura tus preferencias</a>
          </div>
        </div>
      </header>

      <div className='flex-container'>
        <section id="activities" class="activities">
          <h2>Actividades recomendadas</h2>
          <div class="cards">
            <div class="card">
              <img src="public\yoga.avif" alt="Yoga"></img>
              <h3>Yoga en el parque</h3>
              <p>Perfecto para clima soleado 🌞</p>
              <a href="#" class="btn small">Más detalles</a>
            </div>
            <div class="card">
              <img src="public\bici.jpg" alt="Bicicleta"></img>
              <h3>Paseo en bicicleta</h3>
              <p>Ideal con poco viento 💨</p>
              <a href="#" class="btn small">Más detalles</a>
            </div>
            <div class="card">
              <img src="public\fotootoño.jpg" alt="Fotografía"></img>
              <h3>Fotografía de otoño</h3>
              <p>Cielo nublado, luz suave 🌥</p>
              <a href="#" class="btn small">Más detalles</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;

	

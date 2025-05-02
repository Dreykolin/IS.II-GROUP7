import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";
import '../assets/estilos.css';

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
      <div className="flex-container">
        {/* Si el usuario no está autenticado, mostramos el mensaje para iniciar sesión */}
        {!usuarioAutenticado ? (
          <div className="alert alert-warning">
            <h2>Para acceder a la aplicación, necesitas iniciar sesión</h2>
          </div>
        ) : (
          <>
            <div className="tarjeta-ciudad-container">
              <h1>Mi Ubicación Actual</h1>
              <TarjetaCiudad automatico={true} clima={climaAutomatico} ubicacion={ubicacionAutomatica} />
            </div>

            <div className="tarjeta-ciudad-container">
              <h1>Buscar otra Ciudad</h1>
              <TarjetaCiudad />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

	

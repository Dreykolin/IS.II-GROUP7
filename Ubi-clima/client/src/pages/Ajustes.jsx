import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";
import '../assets/estilos.css'; // Importar los estilos CSS


function Ajustes() {
  const [ubicacionAutomatica, setUbicacionAutomatica] = useState('');
  const [climaAutomatico, setClimaAutomatico] = useState('');
  const [ciudadManual, setCiudadManual] = useState('');
  const [climaManual, setClimaManual] = useState('');

  const obtenerUbicacionAutomatica = () => {
    if (!navigator.geolocation) {
      setUbicacionAutomatica("La geolocalización no es compatible.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;
      setUbicacionAutomatica(`Latitud: ${latitud}, Longitud: ${longitud}`);

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`);
        const geoData = await geoRes.json();
        const ciudad = geoData.address?.city || "Ciudad no encontrada";

        await fetch('http://localhost:3000/guardar_ubicacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitud, longitud, ciudad })
        });

        const climaRes = await fetch('http://localhost:3000/clima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitud, lon: longitud })
        });

        const datosClima = await climaRes.json();
        setClimaAutomatico(`Clima: ${datosClima.descripcion}, ${datosClima.temperatura}°C en ${datosClima.ciudad}`);
      } catch (err) {
        console.error(err);
        setClimaAutomatico("Error al obtener ciudad o clima.");
      }
    });
  };

  useEffect(() => {
    obtenerUbicacionAutomatica();
  }, []);

  return (
    <div className="clima-page">
      <div className="flex-container">
        {/* Contenedor izquierdo con TarjetaCiudad automática */}
        <div className="tarjeta-ciudad-container">
          <h1>Mi Ubicación Actual</h1>
          <TarjetaCiudad automatico={true} clima={climaAutomatico} ubicacion={ubicacionAutomatica} />
        </div>

        {/* Contenedor derecho con TarjetaCiudad manual */}
        <div className="tarjeta-ciudad-container">
          <h1>Buscar otra Ciudad</h1>
          <TarjetaCiudad />
        </div>
      </div>
    </div>
  );
}

export default Ajustes;


import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";
import '../assets/estilos.css';

function Ajustes() {
  const [ubicacionAutomatica, setUbicacionAutomatica] = useState('');
  const [climaAutomatico, setClimaAutomatico] = useState('');

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
        setClimaAutomatico(`Clima: ${datosClima.descripcion}, ${datosClima.temperatura}°C`);
        setUbicacionAutomatica(`Ciudad: ${datosClima.ciudad}`);
      } catch (err) {
        console.error(err);
        setClimaAutomatico("Error al obtener clima.");
        setUbicacionAutomatica("");
      }
    });
  };

  useEffect(() => {
    obtenerUbicacionAutomatica();
  }, []);

  return (
    <div className="clima-page">
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
    </div>
  );
}

export default Ajustes;


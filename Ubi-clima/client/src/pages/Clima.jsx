import { useState, useEffect } from 'react';
import TarjetaCiudad from "../components/TarjetaCiudad";

function Clima() {
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
    <div className="container mt-4">
      <div className="row">
        {/* Contenedor izquierdo con TarjetaCiudad automática */}
        <div className="col-md-6 mb-4">
          <div style={{ backgroundColor: '#f0f8ff' }} className="p-4 rounded shadow">
            <h1 className="mb-4" style={{ fontSize: '2rem' }}>Mi Ubicación Actual</h1>
            {/* Renderizamos TarjetaCiudad y le pasamos props para que se comporte automáticamente */}
            <TarjetaCiudad automatico={true} clima={climaAutomatico} ubicacion={ubicacionAutomatica} />
	    <p style={{ fontSize: '1rem' }}><strong></strong>&nbsp;&nbsp;&nbsp;&nbsp;</p>
          </div>
        </div>

        {/* Contenedor derecho con TarjetaCiudad manual */}
        <div className="col-md-6 mb-4">
          <div style={{ backgroundColor: '#f0f8ff' }} className="p-4 rounded shadow">
            <h1 className="mb-4" style={{ fontSize: '2rem' }}>Buscar otra Ciudad</h1>
            {/* Renderizamos otra instancia de TarjetaCiudad para la búsqueda manual */}
            <TarjetaCiudad />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clima;	

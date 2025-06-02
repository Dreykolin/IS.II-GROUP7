import { useEffect, useState } from 'react';
import '../assets/Widget_clima.css';

function WidgetClima() {
  const [clima, setClima] = useState('');
  const [cargando, setCargando] = useState(false);
  const [puedeActualizar, setPuedeActualizar] = useState(false);
  const tiempoLimite = 20 * 1000; // 20 segundos

  const obtenerUbicacionYClima = async () => {
    setCargando(true);
    setPuedeActualizar(false);

    if (!navigator.geolocation) {
      setClima("Geolocalización no disponible.");
      setCargando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await fetch('http://localhost:3000/clima', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat, lon })
        });

        const datos = await res.json();
        const textoClima = `${datos.descripcion}, ${datos.temperatura}°C en ${datos.ciudad}`;
        setClima(textoClima);

        const ahora = Date.now();
        localStorage.setItem('clima', JSON.stringify(textoClima));
        localStorage.setItem('clima_timestamp', ahora.toString());
      } catch (err) {
        console.error('Error al obtener clima:', err);
        setClima("Error al obtener clima.");
      } finally {
        setCargando(false);
      }
    });
  };

  useEffect(() => {
    // Cargar clima inicial desde cache si existe
    const cargarDesdeCache = () => {
      try {
        const cache = localStorage.getItem('clima');
        if (cache) setClima(JSON.parse(cache));
      } catch (err) {
        console.error('Error al cargar clima desde cache:', err);
      }
    };

    cargarDesdeCache();
    obtenerUbicacionYClima();

    // Chequear si ya se puede volver a actualizar
    const intervalo = setInterval(() => {
      const timestamp = localStorage.getItem('clima_timestamp');
      if (!timestamp) {
        setPuedeActualizar(true);
        return;
      }

      const diff = Date.now() - Number(timestamp);
      setPuedeActualizar(diff >= tiempoLimite);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="widget-clima">
      <p>{cargando ? 'Actualizando clima...' : (clima || 'Cargando clima...')}</p>
      <button
        onClick={obtenerUbicacionYClima}
        disabled={!puedeActualizar || cargando}
        style={{
          opacity: !puedeActualizar || cargando ? 0.5 : 1,
          cursor: !puedeActualizar || cargando ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.3s'
        }}
      >
        {cargando ? 'Actualizando...' : 'Actualizar clima'}
      </button>
    </div>
  );
}

export default WidgetClima;

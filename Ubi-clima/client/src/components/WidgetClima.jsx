import { useState, useEffect } from 'react';
import { useClima } from '../context/ClimaContext';
import '../assets/Widget_clima.css';

function WidgetClima() {
  const { datosClima, actualizarClima } = useClima();
  const [clima, setClima] = useState('');
  const [cargando, setCargando] = useState(false);
  const [puedeActualizar, setPuedeActualizar] = useState(true);

  const tiempoLimite = 20 * 1000; // ⏱️ 20 segundos
  const [ultimaActualizacion, setUltimaActualizacion] = useState(() => {
    const t = localStorage.getItem('clima_timestamp');
    return t ? parseInt(t) : 0;
  });

  useEffect(() => {
    if (datosClima && datosClima.descripcion && datosClima.temperatura && datosClima.ciudad) {
      setClima(`${datosClima.descripcion}, ${datosClima.temperatura}°C en ${datosClima.ciudad}`);
    }
  }, [datosClima]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const ahora = Date.now();
      const tiempoPasado = ahora - ultimaActualizacion;
      setPuedeActualizar(tiempoPasado >= tiempoLimite);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [ultimaActualizacion]);

  const obtenerUbicacionYClima = () => {
    if (!navigator.geolocation) {
      setClima("Geolocalización no disponible.");
      return;
    }

    setCargando(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch('http://localhost:3000/clima', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            })
          });

          if (!res.ok) throw new Error('Fallo al obtener clima');

          const data = await res.json();

          const nuevoClima = {
            descripcion: data.descripcion,
            temperatura: data.temperatura,
            ciudad: data.ciudad,
            viento: data.viento,
            tiempo_id: data.tiempo_id
          };

          actualizarClima({ clima: nuevoClima, pronostico: data.pronostico });

          setClima(`${nuevoClima.descripcion}, ${nuevoClima.temperatura}°C en ${nuevoClima.ciudad}`);

          const ahora = Date.now();
          localStorage.setItem('clima_timestamp', ahora.toString());
          setUltimaActualizacion(ahora);
        } catch (error) {
          console.error(error);
          setClima("❌ Error al obtener clima.");
        } finally {
          setCargando(false);
        }
      },
      (error) => {
        setClima(`❌ Error de geolocalización: ${error.message}`);
        setCargando(false);
      }
    );
  };

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

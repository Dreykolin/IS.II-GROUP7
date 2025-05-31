import { useEffect, useState, useRef } from 'react';
import '../assets/Widget_clima.css';

const LIMITE_TIEMPO_MS = 10 * 60 * 1000; // 10 minutos

function WidgetClima() {
    const [clima, setClima] = useState(() => localStorage.getItem('clima') || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const intervaloRef = useRef(null);

    // Función que comprueba si el dato en localStorage está viejo
    const datoViejo = () => {
        const timestampUTC = parseInt(localStorage.getItem('timestamp_utc'), 10);
        const horaLocalRecibida = parseInt(localStorage.getItem('hora_local_recibida'), 10);
        if (!timestampUTC || !horaLocalRecibida) {
            console.log('[datoViejo] No hay timestamps guardados, dato considerado viejo');
            return true;
        }

        const ahoraLocal = Date.now();
        const desfase = timestampUTC - horaLocalRecibida;
        const ahoraEstimadoUTC = ahoraLocal + desfase;

        const diff = ahoraEstimadoUTC - timestampUTC;
        console.log(`[datoViejo] Tiempo desde última actualización: ${diff} ms`);

        return diff > LIMITE_TIEMPO_MS;
    };

    // Actualiza el clima, guarda datos y maneja estados
    const actualizarClima = async () => {
        if (!navigator.geolocation) {
            setError('Geolocalización no disponible.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                console.log('[actualizarClima] Solicitando clima para:', lat, lon);
                const res = await fetch('http://localhost:3000/clima', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat, lon }),
                });

                if (!res.ok) throw new Error('Respuesta no OK');

                const datos = await res.json();
                console.log('[actualizarClima] Datos recibidos:', datos);

                const textoClima = `${datos.descripcion}, ${datos.temperatura}°C en ${datos.ciudad}`;

                setClima(textoClima);
                localStorage.setItem('clima', textoClima);
                localStorage.setItem('timestamp_utc', datos.timestamp_utc.toString());
                localStorage.setItem('hora_local_recibida', Date.now().toString());
                setError('');
            } catch (err) {
                console.error('[actualizarClima] Error:', err);
                setError('No se pudo actualizar el clima, mostrando datos guardados.');
            } finally {
                setLoading(false);
            }
        }, (err) => {
            console.error('[actualizarClima] Error geolocalización:', err);
            setError('No se pudo obtener la ubicación.');
            setLoading(false);
        });
    };

    useEffect(() => {
        // Mostramos clima guardado solo si no está viejo
        if (!datoViejo()) {
            console.log('[useEffect] Dato vigente, mostrando dato guardado.');
            // El estado clima ya carga dato guardado al inicio
            setError('');
            setLoading(false);
        } else {
            console.log('[useEffect] Dato viejo, actualizando clima al montar...');
            actualizarClima();
        }

        // Siempre actualizar cada 5 minutos
        intervaloRef.current = setInterval(() => {
            console.log('[setInterval] Actualizando clima...');
            actualizarClima();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervaloRef.current);
    }, []);

    return (
        <div className="widget-clima">
            {loading && <div>Cargando clima...</div>}
            {!loading && clima && <div>{clima}</div>}
            {!loading && !clima && <div>No hay datos recientes del clima.</div>}
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default WidgetClima;

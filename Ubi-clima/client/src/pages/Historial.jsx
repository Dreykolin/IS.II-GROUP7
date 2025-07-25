import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import '../assets/Historial.css';

const API_BASE = 'http://localhost:3000';

// ⬅️ 1. CORRECCIÓN: Esta función ahora usa el 'usuario_id' que recibe como parámetro.
// Antes intentaba usar una variable 'user' que no existía aquí.
async function obtenerHistorial(usuario_id, mes, año) {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (año) params.append('año', año);
    const res = await fetch(`${API_BASE}/historial/${usuario_id}?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener historial');
    return await res.json();
}

// El componente TarjetaActividad se mantiene igual, está perfecto.
function TarjetaActividad({ actividad }) {
    const [abierto, setAbierto] = useState(false);
    const fecha = new Date(actividad.fecha);
    const fechaStr = fecha.toLocaleDateString();
    const horaStr = fecha.toLocaleTimeString();

    return (
        <div
            className="rounded-xl shadow p-4 mb-4 cursor-pointer transition hover:shadow-lg"
            style={{ backgroundColor: '#f6ebd9' }}
            onClick={() => setAbierto(!abierto)}
        >
            <div className="flex justify-between items-center">
                <strong className="text-lg text-gray-800">{actividad.nombre}</strong>
                <br />
                <span className="text-sm text-gray-600">{fechaStr} – {horaStr}</span>
            </div>
            {abierto && (
                <p className="mt-2 text-sm text-gray-700">{actividad.descripcion}</p>
            )}
        </div>
    );
}

function Historial() {
    // ⬅️ 2. CORRECCIÓN: El hook 'useAuth' se llama AQUÍ, dentro del componente, que es el lugar correcto.
    const { user, isAuthenticated, markTourAsSeen } = useAuth();
    const fechaActual = new Date();
    const [mes, setMes] = useState(String(fechaActual.getMonth() + 1).padStart(2, '0'));
    const [año, setAño] = useState(String(fechaActual.getFullYear()));
    const [historial, setHistorial] = useState([]);

    // --- Lógica del Tour (sin cambios) ---
    const [runTour, setRunTour] = useState(false);
    const [tourSteps] = useState([
        {
            target: '#filtro-fecha-historial',
            content: 'Puedes usar estos filtros para buscar tus actividades por mes y año.',
        },
        {
            target: '#lista-historial',
            content: 'Aquí aparecerán las actividades que hayas realizado. ¡Haz clic en una para ver su descripción!',
        }
    ]);

    useEffect(() => {
        if (isAuthenticated && user?.tours_vistos?.historial === false) {
            setRunTour(true);
        }
    }, [isAuthenticated, user]);

    const handleJoyrideCallback = async (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            await fetch('http://localhost:3000/tour-completado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: user.id, tour_name: 'historial' }),
            });
            markTourAsSeen('historial');
        }
    };
    // --- Fin de la Lógica del Tour ---

    // Este useEffect para cargar el historial está correcto y no necesita cambios.
    useEffect(() => {
        async function cargar() {
            try {
                if (user && mes && año) {
                    const data = await obtenerHistorial(user.id, mes, año);
                    setHistorial(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        cargar();
    }, [user, mes, año]);

    const añosDisponibles = Array.from({ length: 5 }, (_, i) => String(fechaActual.getFullYear() - i));

    if (!isAuthenticated) {
        return (
            <div className="text-center p-5 my-5 bg-light rounded-3 shadow-sm">
                <h2 className="display-6 fw-bold">Historial de Actividades</h2>
                <p className="lead my-3">Por favor, inicia sesión para ver tu historial.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Joyride
                steps={tourSteps}
                run={runTour}
                callback={handleJoyrideCallback}
                continuous
                showProgress
                showSkipButton
                locale={{ last: 'Finalizar' }}
                styles={{ options: { primaryColor: '#ff5a5f' } }}
            />
            <h2 className="text-xl font-bold mb-4 border-bottom pb-2">Historial de Actividades</h2>
            <div id="filtro-fecha-historial" className="flex items-center gap-2 mb-4 p-3 bg-light rounded-3">
                <span className='font-medium'>Filtrar por fecha:</span>
                <select value={mes} onChange={(e) => setMes(e.target.value)} className="border p-2 rounded-md shadow-sm">
                    {[...Array(12).keys()].map(i => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('es-CL', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <select value={año} onChange={(e) => setAño(e.target.value)} className="border p-2 rounded-md shadow-sm">
                    {añosDisponibles.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>
            <div id="lista-historial">
                {historial.length === 0 ? (
                    <p className='text-center text-gray-500 mt-4'>No hay actividades registradas para este período.</p>
                ) : (
                    historial.map((item, index) => (
                        <TarjetaActividad key={index} actividad={item} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Historial;
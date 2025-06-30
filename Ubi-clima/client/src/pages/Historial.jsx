import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ⬅️ 1. Importamos el hook de autenticación
import '../assets/Historial.css';

const API_BASE = 'http://localhost:3000';

// Esta función no necesita cambios, está perfecta.
async function obtenerHistorial(usuario_id, mes, año) {
    const params = new URLSearchParams();
    if (mes) params.append('mes', mes);
    if (año) params.append('año', año);

    const res = await fetch(`${API_BASE}/historial/${usuario_id}?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener historial');
    return await res.json();
}

// El componente de la tarjeta tampoco necesita cambios.
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
                <br></br>
                <span className="text-sm text-gray-600">{fechaStr} – {horaStr}</span>
            </div>
            {abierto && (
                <p className="mt-2 text-sm text-gray-700">{actividad.descripcion}</p>
            )}
        </div>
    );
}

// ⬅️ 2. El componente ya no recibe 'usuarioId' como prop
function Historial() {
    const { user } = useAuth(); // ⬅️ 3. Obtenemos la información del usuario desde el contexto
    const fechaActual = new Date();
    const [mes, setMes] = useState(String(fechaActual.getMonth() + 1).padStart(2, '0'));
    const [año, setAño] = useState(String(fechaActual.getFullYear()));
    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        async function cargar() {
            try {
                // ⬅️ 4. Usamos el 'user' del contexto para la condición y la llamada a la API
                if (user && mes && año) {
                    const data = await obtenerHistorial(user.id, mes, año);
                    setHistorial(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        cargar();
    }, [user, mes, año]); // ⬅️ 5. La dependencia ahora es 'user' en lugar de 'usuarioId'

    const añosDisponibles = Array.from({ length: 5 }, (_, i) => String(fechaActual.getFullYear() - i));

    // ⬅️ 6. Añadimos un mensaje claro si el usuario no ha iniciado sesión
    if (!user) {
        return (
            <div className="text-center p-5 my-5 bg-light rounded-3 shadow-sm">
                <h2 className="display-6 fw-bold">Historial de Actividades</h2>
                <p className="lead my-3">Por favor, inicia sesión para ver tu historial.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="text-xl font-bold mb-4 border-bottom pb-2">Historial de Actividades</h2>

            <div className="flex items-center gap-2 mb-4 p-3 bg-light rounded-3">
                <span className='font-medium'>Filtrar por fecha:</span>
                {/* Selector de mes */}
                <select value={mes} onChange={(e) => setMes(e.target.value)} className="border p-2 rounded-md shadow-sm">
                    {[...Array(12).keys()].map(i => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('es-CL', { month: 'long' })}
                        </option>
                    ))}
                </select>

                {/* Selector de año */}
                <select value={año} onChange={(e) => setAño(e.target.value)} className="border p-2 rounded-md shadow-sm">
                    {añosDisponibles.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>
            </div>

            {historial.length === 0 ? (
                <p className='text-center text-gray-500 mt-4'>No hay actividades registradas para este período.</p>
            ) : (
                historial.map((item, index) => (
                    <TarjetaActividad key={index} actividad={item} />
                ))
            )}
        </div>
    );
}

export default Historial;

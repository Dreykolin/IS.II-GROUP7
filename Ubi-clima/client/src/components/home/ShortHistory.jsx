import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ⬅️ 1. Importamos el AuthContext
import '../../assets/actividadReciente.css'

const API_BASE = 'http://localhost:3000';

// 2. El componente ahora es "inteligente" y busca sus propios datos.
export default function ShortHistory() {
    const { user } = useAuth(); // Obtiene el usuario del contexto
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 3. useEffect para cargar el historial cuando el componente se monta
    useEffect(() => {
        const fetchShortHistory = async () => {
            if (!user) return; // No hace nada si no hay usuario

            setIsLoading(true);
            try {
                // Llama al endpoint que me diste para obtener el historial completo
                const res = await fetch(`${API_BASE}/historial/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Nos quedamos solo con los primeros 3 para un "mini historial"
                    setHistoryItems(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error al cargar el historial reciente:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShortHistory();
    }, [user]); // Se ejecuta cuando la info del usuario está disponible

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center text-muted">Cargando historial...</p>;
        }

        if (!historyItems || historyItems.length === 0) {
            return (
                <div className="text-center text-muted mt-3">
                    <p>Aún no tienes actividades en tu historial.</p>
                    <small>¡Completa una actividad para verla aquí!</small>
                </div>
            );
        }

        return (
            <div className='actividad-list'>
                {historyItems.map((item, index) => (
                    <div key={item.id || index} className="actividad-card">
                        <span className="textoFecha">{item.nombre}</span>
                        <span className="textoFecha">
                            {new Date(item.fecha).toLocaleDateString('es-CL', {
                                day: 'numeric',
                                month: 'short'
                            })}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fullsize">

            <div className="mt-3">
                {renderContent()}
            </div>

            <div className='center'>
                <Link to="/historial" className="btn btn-verHistorial">
                    Ver historial completo
                </Link>
            </div>
        </div>
    );
}
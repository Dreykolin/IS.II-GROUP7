import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ⬅️ 1. Importamos el AuthContext

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
            <div className="list-group list-group-flush">
                {historyItems.map((item, index) => (
                    <div key={item.id || index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                        <span className="fw-bold">{item.nombre}</span>
                        <span className="text-muted small">
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
        <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
                <h3 className="card-title h5">Tu Actividad Reciente</h3>

                <div className="flex-grow-1 mt-3">
                    {renderContent()}
                </div>

                <Link to="/historial" className="btn btn-outline-secondary btn-sm mt-3 align-self-center">
                    Ver historial completo
                </Link>
            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
const ShortHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            const usuario_id = localStorage.getItem('usuario_id');
            if (!usuario_id) return;

            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:3000/historial/${usuario_id}`);
                const data = await res.json();

                // ✅ Mostrar solo las 3 actividades más recientes
                setHistory(data.slice(0, 3));
            } catch (error) {
                console.error("Error al obtener historial:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (isLoading) return <p>Cargando historial...</p>;

    return (
        <div>
            {history.length > 0 ? (
                <>
                    <h2>Tus últimas actividades</h2>
                    {history.map((item, index) => (
                        <div key={index}>
                            <h3>{item.nombre}</h3>
                            <p>{item.descripcion}</p>
                            <p><small>{new Date(item.fecha).toLocaleString()}</small></p>
                        </div>
                    ))}
                </>
            ) : (
                <p>No has hecho ninguna actividad aún.</p>
            )}
        </div>
    );
};
export default ShortHistory;

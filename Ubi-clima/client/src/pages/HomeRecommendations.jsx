import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';   // ⬅️ Usamos nuestro AuthContext
import { useClima } from '../context/ClimaContext'; // ⬅️ Usamos nuestro ClimaContext
import '../assets/RecommendationsList.css'; // Asegúrate de que la ruta a tu CSS sea correcta

export default function HomeRecommendations() {
    // 1. La lógica para obtener los datos desde los contextos se mantiene.
    const { user, isAuthenticated } = useAuth();
    const { datosClima } = useClima();

    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 2. La lógica para cargar las actividades del usuario se mantiene.
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchActivities();
        }
    }, [isAuthenticated, user]);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/actividades/${user.id}`);
            const data = await res.json();
            setActivities(data);
        } catch (error) {
            console.error("Error al obtener actividades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. La lógica para agregar al historial AHORA actualiza la lista.
    const handleAgregar = async (actividad_id) => {
        if (!user) return;

        try {
            const res = await fetch(`http://localhost:3000/registrar_actividad`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: user.id, actividad_id }),
            });

            if (!res.ok) throw new Error('Error en la respuesta del servidor');

            alert('Actividad registrada en tu historial con éxito');

            // ⬅️ ¡AQUÍ ESTÁ LA MAGIA!
            // Después de agregarla, filtramos la lista para quitar la actividad que ya se usó.
            setActivities(prevActivities =>
                prevActivities.filter(activity => activity.id !== actividad_id)
            );

        } catch (err) {
            console.error('Error al registrar actividad:', err);
            alert('No se pudo registrar la actividad en el historial');
        }
    };

    // 4. La lógica de filtrado se mantiene.
    const actividadesFiltradas = (actividad) => {
        if (!datosClima || !actividad) return false;

        const temp = Number(actividad.temperatura);

        return (
            (datosClima.temperatura >= temp - 3 && datosClima.temperatura <= temp + 3)
        );
    };

    // --- Renderizado ---

    if (!isAuthenticated || !datosClima) {
        return null;
    }

    if (isLoading) {
        return <p>Cargando recomendaciones...</p>;
    }

    const filtradas = activities.filter(actividadesFiltradas);

    // ⬅️ Se restaura tu forma original de mostrar los datos.
    return (
        <div className='fullsize center recommendations-list'>
            {filtradas.length > 0 ? (
                <>
                    {filtradas.map((actividad, index) => (
                        <div key={actividad.id || index} className='actividad-recomendada-card'>
                            <h3>{actividad.nombre}</h3>
                            <p>{actividad.descripcion}</p>
                            <button onClick={() => handleAgregar(actividad.id)}>Agregar al historial</button>
                        </div>
                    ))}
                </>
            ) : (
                <p>Las condiciones de tus actividades no se cumplen por ahora ☹️</p>
            )}
        </div>
    );
}

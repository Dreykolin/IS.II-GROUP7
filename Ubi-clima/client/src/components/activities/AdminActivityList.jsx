import React from 'react';

// Este es un componente "tonto". Solo recibe la lista y una función para manejar el click.
export default function AdminActivityList({ adminActivities, onAddActivity, isLoading }) {

    if (isLoading) {
        return <p>Cargando actividades recomendadas...</p>;
    }

    return (
        <div id="admin-activity-list" className="activity-container admin-recommendations">
            <h1>Recomendaciones Generales</h1>
            <p className="text-muted">Actividades sugeridas por el administrador que puedes añadir a tu lista personal.</p>

            {adminActivities.length > 0 ? (
                adminActivities.map((actividad) => (
                    <div key={actividad.id} className="activity-card admin-card">
                        <h2>{actividad.nombre}</h2>
                        <p>{actividad.descripcion}</p>
                        <div className="details">
                            <span>Temp: {actividad.temperatura}°C</span>
                            <span>Viento: {actividad.viento} m/s</span>
                        </div>
                        {/* El botón llama a la función que le pasa el componente padre (Activities.jsx) */}
                        <button onClick={() => onAddActivity(actividad)}>
                            + Añadir a mis actividades
                        </button>
                    </div>
                ))
            ) : (
                <p>No hay actividades recomendadas por el administrador en este momento.</p>
            )}
        </div>
    );
}

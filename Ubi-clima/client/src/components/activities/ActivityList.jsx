import { useState } from 'react';

// ⬅️ Recibe la lista de actividades y las funciones para manipularlas como props
export default function ActivityList({ activities, onToggleEdit, onModify, onDelete, isLoading }) {

    // Estado para manejar los datos del formulario de edición de forma controlada
    const [editData, setEditData] = useState({});

    const handleEditChange = (e) => {
        const { id, value } = e.target;
        setEditData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = (index) => {
        onModify(index, editData);
        setEditData({}); // Limpia el estado de edición después de guardar
    };

    return (
        <div id="activity-list-section" className="activity-container">
            <h1>Tus actividades</h1>
            {isLoading ? (
                <p>Cargando actividades...</p>
            ) : activities.length > 0 ? (
                activities.map((item, index) => (
                    <div key={item.id || index} className="activity-card">
                        {item.editing_mode ? (
                            // --- Modo Edición ---
                            <div>
                                <p>Nombre:</p>
                                <input id="nombre" defaultValue={item.nombre} onChange={handleEditChange} />
                                <p>Descripción:</p>
                                <textarea id="descripcion" defaultValue={item.descripcion} onChange={handleEditChange} />
                                <p>Temperatura ideal:</p>
                                <input id="temperatura" type="number" defaultValue={item.temperatura} onChange={handleEditChange} />
                                <p>Viento ideal:</p>
                                <input id="viento" type="number" defaultValue={item.viento} onChange={handleEditChange} />
                                <p>Lluvia:</p>
                                <input id="lluvia" type="number" defaultValue={item.lluvia} onChange={handleEditChange} />
                                <p>Índice UV:</p>
                                <input id="uv" type="number" defaultValue={item.uv} onChange={handleEditChange} />
                                <button onClick={() => handleSave(index)}>Guardar cambios</button>
                                <button onClick={() => onToggleEdit(index)}>Cancelar</button>
                            </div>
                        ) : (
                            // --- Modo Visualización ---
                            <div>
                                <h2>{item.nombre}</h2>
                                <p>{item.descripcion}</p>
                                <p>Temperatura ideal: {item.temperatura}°C</p>
                                <p>Viento ideal: {item.viento} m/s</p>
                                <p>Lluvia: {item.lluvia} mm</p>
                                <p>Índice UV: {item.uv}</p>
                                <button onClick={() => onToggleEdit(index)}>Editar</button>
                                <button onClick={() => onDelete(index)}>Eliminar</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No tienes actividades guardadas</p>
            )}
            <p className="total">Total: {activities.length} actividades</p>
        </div>
    );
}
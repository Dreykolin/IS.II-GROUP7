import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ⬅️ Conectado al AuthContext
import ActivityForm from '../components/activities/ActivityForm'; // ⬅️ Importa el nuevo componente de formulario
import ActivityList from '../components/activities/ActivityList'; // ⬅️ Importa el nuevo componente de lista
import '../assets/activities2.css';

function Activities() {
    const { user, isAuthenticated } = useAuth(); // ⬅️ Obtiene el usuario y el estado de auth del contexto
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Carga las actividades del usuario cuando el componente se monta o cuando el usuario cambia
    useEffect(() => {
        if (user) {
            loadUserActivities();
        }
    }, [user]);

    // Función para obtener las actividades del usuario desde el backend
    const loadUserActivities = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/actividades/${user.id}`);
            const data = await res.json();
            // Añade la propiedad 'editing_mode' a cada actividad para controlar la UI
            setActivities(data.map(act => ({ ...act, editing_mode: false })));
        } catch (error) {
            console.error("Error al obtener actividades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para crear una nueva actividad (se pasa a ActivityForm)
    const createActivity = async (formData) => {
        const body = { ...formData, usuario_id: user.id };
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3000/guardar_actividad', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                alert("✅ Actividad guardada correctamente");
                loadUserActivities(); // Recarga la lista para obtener la nueva actividad con su ID de la BD
            } else {
                const error = await res.json();
                alert("❌ Error: " + error.error);
            }
        } catch (err) {
            console.error("❌ Error al guardar:", err);
            alert("Error de red");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para guardar cambios de una actividad (se pasa a ActivityList)
    const modifyActivity = (index, editData) => {
        // Aquí iría la lógica para guardar los cambios en el backend (fetch con método PUT/PATCH)
        console.log("Guardando cambios para:", activities[index].id, editData);
        const updatedActivities = [...activities];
        updatedActivities[index] = { ...updatedActivities[index], ...editData, editing_mode: false };
        setActivities(updatedActivities);
    };

    // Función para eliminar una actividad (se pasa a ActivityList)
    const deleteActivity = async (index) => {
        if (window.confirm("¿Estás seguro de eliminar esta actividad?")) {
            // Aquí iría la lógica para eliminar en el backend (fetch con método DELETE)
            console.log("Eliminando actividad:", activities[index].id);
            setActivities(activities.filter((_, i) => i !== index));
            alert("Actividad eliminada (simulado). Implementar backend.");
        }
    };

    // Función para activar/desactivar el modo edición (se pasa a ActivityList)
    const toggleEditMode = (index) => {
        const updated = [...activities];
        updated[index].editing_mode = !updated[index].editing_mode;
        setActivities(updated);
    };

    // Si el usuario no está autenticado, muestra un mensaje
    if (!isAuthenticated) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <h2>Para gestionar tus actividades, necesitas iniciar sesión</h2>
                </div>
            </div>
        );
    }

    // Renderizado principal: pasa el estado y las funciones a los componentes hijos
    return (
        <div className="activities-page">
            <ActivityList
                activities={activities}
                isLoading={isLoading}
                onToggleEdit={toggleEditMode}
                onModify={modifyActivity}
                onDelete={deleteActivity}
            />
            <ActivityForm
                onCreateActivity={createActivity}
                isLoading={isLoading}
            />
        </div>
    );
}

export default Activities;

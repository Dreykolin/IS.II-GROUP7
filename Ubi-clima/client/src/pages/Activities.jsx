import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride'; // ⬅️ 1. Imports para el tour
import { useAuth } from '../context/AuthContext';
import ActivityForm from '../components/activities/ActivityForm';
import ActivityList from '../components/activities/ActivityList';
import '../assets/activities2.css';

function Activities() {
    // ⬅️ 2. Obtenemos todo lo necesario, incluyendo markTourAsSeen
    const { user, isAuthenticated, markTourAsSeen } = useAuth();
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- Lógica del Tour para la página de Actividades ---
    const [runTour, setRunTour] = useState(false);

    // 3. Definimos los pasos específicos para esta página
    const [tourSteps] = useState([
        {
            target: '#activity-list-section',
            content: 'Aquí verás la lista de todas tus actividades personales. Puedes editarlas o eliminarlas en cualquier momento.',
            placement: 'right',
        },
        {
            target: '#activity-form-section',
            content: 'Usa este formulario para crear nuevas actividades personalizadas con tus propias condiciones de clima.',
            placement: 'left',
        }
    ]);

    // 4. El useEffect ahora comprueba el tour específico de 'actividades'
    useEffect(() => {
        if (isAuthenticated && user?.tours_vistos?.actividades === false) {
            setRunTour(true);
        }
    }, [isAuthenticated, user]);

    // 5. El callback marca el tour 'actividades' como visto
    const handleJoyrideCallback = async (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
            await fetch('http://localhost:3000/tour-completado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: user.id, tour_name: 'actividades' }),
            });
            markTourAsSeen('actividades');
        }
    };
    // --- Fin de la Lógica del Tour ---

    // Carga las actividades del usuario
    useEffect(() => {
        if (user) {
            loadUserActivities();
        }
    }, [user]);

    const loadUserActivities = async () => {
        // ... (el resto de tu lógica se mantiene igual)
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/actividades/${user.id}`);
            const data = await res.json();
            setActivities(data.map(act => ({ ...act, editing_mode: false })));
        } catch (error) {
            console.error("Error al obtener actividades:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createActivity = async (formData) => {
        // ...
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
                loadUserActivities();
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

    const modifyActivity = (index, editData) => {
        // ...
        console.log("Guardando cambios para:", activities[index].id, editData);
        const updatedActivities = [...activities];
        updatedActivities[index] = { ...updatedActivities[index], ...editData, editing_mode: false };
        setActivities(updatedActivities);
    };

    const deleteActivity = async (index) => {
        // ...
        if (window.confirm("¿Estás seguro de eliminar esta actividad?")) {
            console.log("Eliminando actividad:", activities[index].id);
            setActivities(activities.filter((_, i) => i !== index));
            alert("Actividad eliminada (simulado). Implementar backend.");
        }
    };

    const toggleEditMode = (index) => {
        // ...
        const updated = [...activities];
        updated[index].editing_mode = !updated[index].editing_mode;
        setActivities(updated);
    };

    if (!isAuthenticated) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <h2>Para gestionar tus actividades, necesitas iniciar sesión</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="activities-page">
            {/* 6. Añadimos el componente Joyride a la página */}
            <Joyride
                steps={tourSteps}
                run={runTour}
                callback={handleJoyrideCallback}
                continuous
                showProgress
                showSkipButton
                locale={{ last: 'Finalizar' }}
                styles={{
                    options: {
                        primaryColor: '#ff5a5f',
                    },
                }}
            />

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
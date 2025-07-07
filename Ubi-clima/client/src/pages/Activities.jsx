import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import ActivityForm from '../components/activities/ActivityForm';
import ActivityList from '../components/activities/ActivityList';
import AdminActivityList from '../components/activities/AdminActivityList';

import '../assets/activities2.css';

function Activities() {
    const { user, isAuthenticated, markTourAsSeen } = useAuth();
    const [activities, setActivities] = useState([]);
    const [adminActivities, setAdminActivities] = useState([]);
    
    // ⬅️ 1. ESTADOS DE CARGA SEPARADOS para evitar conflictos
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(false);

    // --- Lógica del Tour (sin cambios) ---
    const [runTour, setRunTour] = useState(false);
    const [tourSteps] = useState([
        {
            target: '#activity-list-section',
            content: 'Aquí verás la lista de todas tus actividades personales. Puedes editarlas o eliminarlas.',
            placement: 'right',
        },
        {
            target: '#activity-form-section',
            content: 'Usa este formulario para crear nuevas actividades con tus propias condiciones de clima.',
            placement: 'left',
        },
        {
            target: '#admin-activity-list',
            content: 'Y aquí tienes actividades recomendadas por el administrador. ¡Puedes añadirlas a tu lista personal!',
            placement: 'left',
        }
    ]);

    useEffect(() => {
        if (isAuthenticated && user?.tours_vistos?.actividades === false) {
            setRunTour(true);
        }
    }, [isAuthenticated, user]);

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
    
    // --- Lógica de Datos (Mejorada) ---
    useEffect(() => {
        if (user) {
            // ⬅️ 2. Usamos Promise.all para cargar todo simultáneamente
            Promise.all([
                loadUserActivities(),
                loadAdminActivities()
            ]);
        }
    }, [user]);

    const loadUserActivities = async () => {
        if (!user) return;
        setIsUserLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/actividades/${user.id}`);
            const data = await res.json();
            setActivities(data.map(act => ({ ...act, editing_mode: false })));
        } catch (error) {
            console.error("Error al obtener actividades:", error);
        } finally {
            setIsUserLoading(false);
        }
    };
    
    const loadAdminActivities = async () => {
        setIsAdminLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/admin`);
            const data = await res.json();
            setAdminActivities(data);
        } catch (error) {
            console.error("Error al obtener actividades del admin:", error);
        } finally {
            setIsAdminLoading(false);
        }
    };

    const createActivity = async (formData) => {
        const body = { ...formData, usuario_id: user.id };
        setIsUserLoading(true); // Afecta la carga de la lista de usuario
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
            setIsUserLoading(false);
        }
    };

    const addAdminActivity = async (activityToAdd) => {
        const newActivityForUser = { ...activityToAdd, usuario_id: user.id };
        delete newActivityForUser.id;

        try {
            const res = await fetch('http://localhost:3000/guardar_actividad', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivityForUser)
            });
            if (res.ok) {
                alert("✅ Actividad recomendada añadida a tu lista.");
                loadUserActivities();
            } else {
                const error = await res.json();
                alert("❌ Error: " + error.error);
            }
        } catch (err) {
            console.error("❌ Error al guardar:", err);
        }
    };

    // --- Funciones de Edición (sin cambios) ---
    const modifyActivity = (index, editData) => { /*...*/ };
    const deleteActivity = async (index) => { /*...*/ };
    const toggleEditMode = (index) => { /*...*/ };

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
            <Joyride steps={tourSteps} run={runTour} callback={handleJoyrideCallback} continuous showProgress showSkipButton locale={{ last: 'Finalizar' }} styles={{ options: { primaryColor: '#ff5a5f' } }} />
            
            {/* ⬅️ 3. Pasamos el estado de carga correcto a cada componente */}
            <ActivityList activities={activities} isLoading={isUserLoading} onToggleEdit={toggleEditMode} onModify={modifyActivity} onDelete={deleteActivity} />
            
            <div className="right-column">
                <ActivityForm onCreateActivity={createActivity} isLoading={isUserLoading} />
                <AdminActivityList adminActivities={adminActivities} onAddActivity={addAdminActivity} isLoading={isAdminLoading} />
            </div>
        </div>
    );
}

export default Activities;
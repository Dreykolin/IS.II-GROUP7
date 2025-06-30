import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride'; // ⬅️ 1. Imports necesarios
import { useAuth } from '../context/AuthContext';
import AdminAjustes from './AdminAjustes';
import PreferenceSelector from './PreferenceSelector';
import RecommendationList from './RecommendationList';
import AdminUsuarios from './AdminUsuarios';
import '../assets/Administrador.css';

export default function Administrador() {
    const [seccion, setSeccion] = useState('home');
    // ⬅️ 2. Obtenemos la lógica de autenticación y tours del contexto
    const { isAuthenticated, user, markTourAsSeen } = useAuth();

    // --- Lógica del Tour para la página de Administrador ---
    const [runTour, setRunTour] = useState(false);

    // 3. Definimos los pasos específicos para esta página
    const [tourSteps] = useState([
        {
            target: '.sidebar h2',
            content: '¡Bienvenido al Panel de Administrador! Desde esta barra lateral puedes navegar por las diferentes secciones.',
        },
        {
            target: '#admin-nav-usuarios',
            content: 'Aquí puedes ver y gestionar la lista de todos los usuarios registrados.',
            placement: 'right',
        },
        {
            target: '#admin-nav-gustos',
            content: 'En esta sección, puedes visualizar las preferencias de gustos de los usuarios.',
            placement: 'right',
        },
        {
            target: '#admin-nav-recomendaciones',
            content: 'Aquí puedes añadir o editar las recomendaciones de actividades para todos.',
            placement: 'right',
        },
        {
            target: '#admin-nav-ajustes',
            content: 'Y aquí encontrarás los ajustes generales del sistema. ¡Explora con cuidado!',
            placement: 'right',
        },
    ]);

    // 4. El useEffect comprueba el tour específico de 'administrador'
    useEffect(() => {
        if (isAuthenticated && user?.tours_vistos?.administrador === false) {
            setRunTour(true);
        }
    }, [isAuthenticated, user]);

    // 5. El callback marca el tour 'administrador' como visto
    const handleJoyrideCallback = async (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            await fetch('http://localhost:3000/tour-completado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: user.id, tour_name: 'administrador' }),
            });
            markTourAsSeen('administrador');
        }
    };
    // --- Fin de la Lógica del Tour ---

    return (
        <div className="admin-dashboard">
            {/* 6. Añadimos el componente Joyride */}
            <Joyride
                steps={tourSteps}
                run={runTour}
                callback={handleJoyrideCallback}
                continuous
                showProgress
                showSkipButton
                locale={{ last: 'Finalizar' }}
            />

            <aside className="sidebar">
                <h2>AdminPanel</h2>
                {/* 7. Añadimos IDs a los elementos que el tour necesita encontrar */}
                <ul>
                    <li id="admin-nav-usuarios" onClick={() => setSeccion('usuarios')} style={{ cursor: 'pointer' }}>
                        Usuarios
                    </li>
                    <li id="admin-nav-gustos" onClick={() => setSeccion('gustos')} style={{ cursor: 'pointer' }}>
                        Gustos
                    </li>
                    <li id="admin-nav-recomendaciones" onClick={() => setSeccion('recomendaciones')} style={{ cursor: 'pointer' }}>
                        Recomendaciones
                    </li>
                    <li id="admin-nav-ajustes" onClick={() => setSeccion('ajustes')} style={{ cursor: 'pointer' }}>
                        Ajustes
                    </li>
                </ul>
            </aside>

            <main className="admin-content">
                {seccion === 'home' && (
                    <>
                        <h1>Bienvenido, administrador</h1>
                        <p>Aquí puedes gestionar todo el sistema.</p>
                    </>
                )}
                {seccion === 'ajustes' && <AdminAjustes volverHome={() => setSeccion('home')} />}
                {seccion === 'gustos' && <PreferenceSelector />}
                {seccion === 'recomendaciones' && <RecommendationList />}
                {seccion === 'usuarios' && <AdminUsuarios />}
            </main>
        </div>
    );
}

import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import AdminAjustes from './AdminAjustes';
import PreferenceSelector from './PreferenceSelector';
import RecommendationList from './RecommendationList';
import AdminUsuarios from './AdminUsuarios';
import '../assets/Administrador.css';

export default function Administrador() {
    const [seccion, setSeccion] = useState('home');
    const { isAuthenticated, user, markTourAsSeen } = useAuth();

    // Lógica del Tour
    const [runTour, setRunTour] = useState(false);

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

    useEffect(() => {
        if (isAuthenticated && user?.tours_vistos?.administrador === false) {
            setRunTour(true);
        }
    }, [isAuthenticated, user]);

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

    return (
        <div className="admin-dashboard">
            <Joyride
                steps={tourSteps}
                run={runTour}
                callback={handleJoyrideCallback}
                continuous
                showProgress
                showSkipButton
                locale={{ last: 'Finalizar' }}
            />

            <div className="admin-main-content">
                <aside className="sidebar">
                    <h2>AdminPanel</h2>
                    <ul>
                        <li id="admin-nav-usuarios" onClick={() => setSeccion('usuarios')}>
                            Usuarios
                        </li>
                        <li id="admin-nav-gustos" onClick={() => setSeccion('gustos')}>
                            Gustos
                        </li>
                        <li id="admin-nav-recomendaciones" onClick={() => setSeccion('recomendaciones')}>
                            Recomendaciones
                        </li>
                        <li id="admin-nav-ajustes" onClick={() => setSeccion('ajustes')}>
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

            {/* Footer solo para admin - versión minimalista */}
            {!window.location.pathname.includes('home') && (
                <footer className="admin-footer">
                    <div className="footer-content">
                        <div>© 2025 WeatherAct - Panel Administrativo</div>
                        <div className="footer-links">
                            <a href="/admin/politica-privacidad">Política de privacidad</a>
                            <a href="/admin/contacto">Contacto técnico</a>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

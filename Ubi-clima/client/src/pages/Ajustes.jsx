import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride'; // ⬅️ Imports para el tour
import { useAuth } from '../context/AuthContext';
import '../assets/AjustesUsuario.css';

// ⬅️ Componente actualizado para recibir el 'user' como prop
const PreferenceSelector = ({ user }) => {
    const [preferences, setPreferences] = useState({
        outdoor: 3,
        indoor: 3,
        sports: 3,
        intellectual: 3
    });

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const nuevoValor = Number(value);
        setPreferences(prev => ({ ...prev, [name]: nuevoValor }));

        // Si no hay usuario, no se guarda en el backend
        if (!user) return;

        try {
            await fetch('http://localhost:3000/api/guardar-preferencia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: user.id, // ⬅️ Usa el ID del usuario del contexto
                    categoria: name,
                    valor: nuevoValor
                })
            });
        } catch (error) {
            console.error('Error al guardar preferencia:', error);
        }
    };

    return (
        <div id="ajustes-gustos" className='gustos-div'>
            <h1>Define tus gustos</h1>
            <p>Del 1 al 5, califica las siguientes categorías según cuánto te gustan.</p>
            {Object.entries(preferences).map(([key, value]) => (
                <div key={key}>
                    <p style={{ textTransform: 'capitalize' }}>{key}</p>
                    <input
                        className='slider-ajuste'
                        type="range"
                        min="1"
                        max="5"
                        name={key}
                        value={value}
                        onChange={handleChange}
                    />
                    <p>Valor: {value}</p>
                </div>
            ))}
        </div>
    );
};

export default function Ajustes() {
    // ⬅️ Obtenemos todo lo necesario del AuthContext
    const { isAuthenticated, user, markTourAsSeen } = useAuth();

    // --- Lógica del Tour para la página de Ajustes ---
    const [runTour, setRunTour] = useState(false);

    const [tourSteps] = useState([
        {
            target: '#ajustes-gustos',
            content: 'Primero, puedes ajustar tus preferencias. Esto nos ayuda a darte mejores recomendaciones de actividades.',
            placement: 'bottom',
        },
        {
            target: '#ajustes-cuenta',
            content: 'En esta sección puedes gestionar los datos de tu cuenta.',
        },
        {
            target: '#ajustes-notificaciones',
            content: 'Aquí configuras cómo y cuándo quieres recibir notificaciones.',
        }
    ]);

    useEffect(() => {
        // Comprobamos el tour específico de 'ajustes'
        if (isAuthenticated && user?.tours_vistos?.ajustes === false) {
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
                body: JSON.stringify({ usuario_id: user.id, tour_name: 'ajustes' }),
            });
            markTourAsSeen('ajustes');
        }
    };
    // --- Fin de la Lógica del Tour ---

    // Usamos 'isAuthenticated' del contexto para decidir qué mostrar
    if (!isAuthenticated) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <h2>Para acceder a los ajustes, necesitas iniciar sesión</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container-ajustes">
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

            {/* ⬅️ Le pasamos el 'user' al componente hijo */}
            <PreferenceSelector user={user} />

            <h2 className="mb-4">Ajustes Generales</h2>

            {/* ⬅️ Añadimos IDs para que el tour los encuentre */}
            <div id="ajustes-cuenta" className="card-grande">
                <div className="card-body">
                    <h5 className="card-title">Cuenta</h5>
                    <p className="card-text">Cambiar correo electrónico, contraseña u otros datos personales.</p>
                    <button className="btn btn-outline-primary">Editar cuenta</button>
                </div>
            </div>

            <br />

            <div id="ajustes-notificaciones" className="card-grande">
                <div className="card-body">
                    <h5 className="card-title">Notificaciones</h5>
                    <p className="card-text">Configura cómo y cuándo deseas recibir notificaciones.</p>
                    <button className="btn btn-outline-secondary">Preferencias de notificación</button>
                </div>
            </div>

            <br />

            <div id="ajustes-privacidad" className="card-grande">
                <div className="card-body">
                    <h5 className="card-title">Privacidad</h5>
                    <p className="card-text">Revisa y ajusta tus opciones de privacidad.</p>
                    <button className="btn btn-outline-danger">Configuración de privacidad</button>
                </div>
            </div>
        </div>
    );
}
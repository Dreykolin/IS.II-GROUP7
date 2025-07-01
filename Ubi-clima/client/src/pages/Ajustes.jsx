import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import '../assets/AjustesUsuario.css';

// ⬅️ Componente hijo actualizado con guardar gusto y botón "Guardar Gustos"
const PreferenceSelector = ({ user, updateUserPreferences }) => {
    const [preferences, setPreferences] = useState({
        outdoor: 3,
        indoor: 3,
        sports: 3,
        intellectual: 3,
    });

    useEffect(() => {
        if (user?.preferencias) {
            setPreferences(user.preferencias);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            for (const [key, value] of Object.entries(preferences)) {
                await fetch('http://localhost:3000/api/guardar-preferencia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: user.id,
                        categoria: key,
                        valor: value,
                    }),
                });
            }

            updateUserPreferences(preferences);
            alert('✅ ¡Tus gustos han sido guardados!');
        } catch (error) {
            console.error('Error al guardar los gustos:', error);
            alert('❌ Hubo un problema al guardar tus gustos.');
        }
    };

    return (
        <div id="ajustes-gustos" className="gustos-div">
            <form onSubmit={handleSave}>
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
                <button type="submit" className="btn btn-primary mt-3">Guardar Gustos</button>
            </form>
        </div>
    );
};

export default function Ajustes() {
    const { isAuthenticated, user, markTourAsSeen, updateUserPreferences } = useAuth();

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
        },
    ]);

    useEffect(() => {
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

    const [accountDetails, setAccountDetails] = useState({
        email: user?.email || '',
        password: '',
    });

    useEffect(() => {
        if (user?.email) {
            setAccountDetails(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleAccountSave = async (e) => {
        e.preventDefault();
        if (!accountDetails.email) {
            alert('El correo no puede estar vacío.');
            return;
        }

        const body = {
            usuario_id: user.id,
            email: accountDetails.email,
        };
        if (accountDetails.password) {
            body.password = accountDetails.password;
        }

        try {
            const res = await fetch('http://localhost:3000/api/actualizar-cuenta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                alert('✅ ¡Cuenta actualizada! Se recomienda volver a iniciar sesión.');
                setAccountDetails(prev => ({ ...prev, password: '' }));
            } else {
                const error = await res.json();
                alert(`❌ Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error al actualizar la cuenta:', error);
            alert('Hubo un problema de conexión al actualizar la cuenta.');
        }
    };

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
                styles={{ options: { primaryColor: '#ff5a5f' } }}
            />

            {/* ⬅️ Pasamos funciones necesarias al componente hijo */}
            <PreferenceSelector user={user} updateUserPreferences={updateUserPreferences} />

            <h2 className="mb-4">Ajustes Generales</h2>

            <div id="ajustes-cuenta" className="card-grande">
                <div className="card-body">
                    <h5 className="card-title">Cuenta</h5>
                    <form onSubmit={handleAccountSave}>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={accountDetails.email}
                                onChange={handleAccountChange}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Nueva Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Dejar en blanco para no cambiar"
                                value={accountDetails.password}
                                onChange={handleAccountChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-secondary mt-3">Guardar Cambios de Cuenta</button>
                    </form>
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

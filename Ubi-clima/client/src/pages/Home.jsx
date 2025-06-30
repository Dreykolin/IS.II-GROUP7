import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext'; // ⬅️ 1. Importamos el hook que nos da acceso a todo
import { useClima } from '../context/ClimaContext';
import TarjetaCiudad from "../components/home/TarjetaCiudad";
import RecommendationsList from "../components/home/RecommendationsList";
import ShortHistory from "../components/home/ShortHistory";
import Pronostico from "../components/home/Pronostico";
import '../assets/home.css';

function Home() {
    const { datosClima } = useClima();
    // ⬅️ 2. Obtenemos 'markTourAsSeen' en lugar de 'updateUser'
    const { isAuthenticated, user, markTourAsSeen } = useAuth();
    const [mostrarPronostico, setMostrarPronostico] = useState(false);

    // --- Lógica del Tour de Bienvenida (ACTUALIZADA) ---
    const [runTour, setRunTour] = useState(false);
    const [tourSteps] = useState([
        {
            target: '.recommendations-list',
            content: '¡Bienvenido! Aquí encontrarás nuestras recomendaciones de actividades.',
            placement: 'bottom',
        },
        {
            target: '.short-history',
            content: 'Este es un resumen de tus últimas actividades.',
            placement: 'bottom',
        },
        {
            target: '.weather-card-container',
            content: 'Y aquí tienes la tarjeta del clima. ¡Puedes cambiar a la vista de pronóstico!',
            placement: 'top',
        },
    ]);

    // ⬅️ 3. useEffect ahora comprueba el tour específico de 'home'
    useEffect(() => {
        // Si el usuario está logueado y el tour 'home' no ha sido visto...
        if (isAuthenticated && user && user.tours_vistos && user.tours_vistos.home === false) {
            setRunTour(true);
        }
    }, [isAuthenticated, user]);

    // ⬅️ 4. handleJoyrideCallback ahora actualiza el tour específico de 'home'
    const handleJoyrideCallback = async (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRunTour(false);
            try {
                // Le decimos al backend qué tour específico completar
                await fetch('http://localhost:3000/tour-completado', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: user.id, tour_name: 'home' }),
                });
                // Actualizamos el estado local usando la nueva función del contexto
                markTourAsSeen('home');
            } catch (error) {
                console.error("Error al marcar el tour 'home' como completado:", error);
            }
        }
    };
    // --- Fin de la Lógica del Tour ---

    return (
        <div className="clima-page">
            <Joyride
                steps={tourSteps}
                run={runTour}
                callback={handleJoyrideCallback}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                locale={{ last: 'Finalizar' }}
                styles={{
                    options: {
                        primaryColor: '#ff5a5f',
                        textColor: '#333',
                    },
                }}
            />

            {!isAuthenticated ? (
                <div className="flex-container">
                    <div className="alert alert-warning alerta-usuario">
                        <h2>Para acceder a la aplicación, necesitas iniciar sesión</h2>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-container recommendations-list">
                        <RecommendationsList />
                    </div>

                    <div className="flex-container short-history">
                        <ShortHistory />
                    </div>

                    <div className="flex-container-2 weather-card-container">
                        {!mostrarPronostico && <h2>Resumen del clima de hoy</h2>}
                        {!mostrarPronostico ? (
                            <>
                                <TarjetaCiudad />
                                <button
                                    onClick={() => setMostrarPronostico(true)}
                                    className="btn"
                                >
                                    Ver pronóstico
                                </button>
                            </>
                        ) : (
                            <>
                                <Pronostico />
                                <button
                                    onClick={() => setMostrarPronostico(false)}
                                    className="btn"
                                >
                                    Ver clima de hoy
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}

            <header id="home" className="hero">
                <div className="hero-content">
                    <h1>¡Descubre qué hacer hoy con el clima a tu favor!</h1>
                    <p>Recomendaciones personalizadas para cada día, cada clima y cada persona.</p>
                    <div className="hero-buttons">
                        <a href="#activities" className="btn primary">Ver recomendaciones</a>
                    </div>
                </div>
            </header>

            <div className="flex-container">
                <section id="activities" className="activities">
                    <h2>Actividades recomendadas</h2>
                    <div className="cards">
                        <div className="card">
                            <img src="/yoga.avif" alt="Yoga" />
                            <h3>Yoga en el parque</h3>
                            <p>Perfecto para clima soleado 🌞</p>
                            <a href="#" className="btn small">Más detalles</a>
                        </div>
                        <div className="card">
                            <img src="/bici.jpg" alt="Bicicleta" />
                            <h3>Paseo en bicicleta</h3>
                            <p>Ideal con poco viento 💨</p>
                            <a href="#" className="btn small">Más detalles</a>
                        </div>
                        <div className="card">
                            <img src="/fotootoño.jpg" alt="Fotografía" />
                            <h3>Fotografía de otoño</h3>
                            <p>Cielo nublado, luz suave 🌥</p>
                            <a href="#" className="btn small">Más detalles</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;

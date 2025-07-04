import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa también updateUserPreferences
import '../assets/PreferenceSelector.css';

export default function PreferenceSelector({ onComplete }) {
    const { user, updateUserPreferences } = useAuth(); // ⬅️ AHORA importas la función

    const [preferencias, setPreferencias] = useState({
        outdoor: 3,
        indoor: 3,
        sports: 3,
        intellectual: 3,
    });

    // Almacenar temporalmente las nuevas preferencias para enviarlas todas juntas
    const handleSliderChange = async (key, value) => {
        const nuevasPreferencias = { ...preferencias, [key]: value };
        setPreferencias(nuevasPreferencias);

        if (!user) return;

        try {
            await fetch('http://localhost:3000/api/guardar-preferencia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: user.id,
                    categoria: key,
                    valor: value
                })
            });

            // 🔑 Aquí actualizas el contexto global
            updateUserPreferences(nuevasPreferencias);

        } catch (error) {
            console.error('Error al guardar preferencia:', error);
        }
    };

    return (
        <section className="preference-sliders">
            <h2>Define tus gustos</h2>
            <p className="description">
                Del 1 al 5, califica las siguientes categorías según cuánto te gustan.
            </p>

            <div className="sliders-container">
                {Object.entries(preferencias).map(([key, value]) => (
                    <div className="slider-group" key={key}>
                        <label style={{ textTransform: 'capitalize' }}>{key}</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={value}
                            onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                        />
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            {onComplete && (
                <button className="btn-continuar" onClick={onComplete}>
                    Continuar
                </button>
            )}
        </section>
    );
}

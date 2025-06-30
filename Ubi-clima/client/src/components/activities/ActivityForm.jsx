import { useState } from 'react';

// ⬅️ Este componente recibe la función para crear y el estado de carga como props
export default function ActivityForm({ onCreateActivity, isLoading }) {
    const initialFormState = {
        nombre: '',
        descripcion: '',
        temperatura: '',
        viento: '',
        lluvia: '',
        uv: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    // ⬅️ Maneja los cambios en los inputs de forma controlada
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nombre) {
            alert("El nombre es obligatorio");
            return;
        }
        // Llama a la función del padre con los datos del formulario
        onCreateActivity(formData);
        // Limpia el formulario
        setFormData(initialFormState);
    };

    return (
        <div id="activity-form-section" className='form-container'>
            <h1>Crear Actividad</h1>
            <form onSubmit={handleSubmit}>
                <p>Nombre*</p>
                <input id="nombre" placeholder="Nombre de la actividad" value={formData.nombre} onChange={handleChange} />

                <p>Descripción</p>
                <input id="descripcion" placeholder="Descripción de la actividad" value={formData.descripcion} onChange={handleChange} />

                <p>Temperatura ideal (°C)</p>
                <input id="temperatura" type="number" placeholder="25" value={formData.temperatura} onChange={handleChange} />

                <p>Velocidad ideal del viento (m/s)</p>
                <input id="viento" type="number" placeholder="5" value={formData.viento} onChange={handleChange} />

                <p>Lluvia (mm)</p>
                <input id="lluvia" type="number" placeholder="0" value={formData.lluvia} onChange={handleChange} />

                <p>Índice UV</p>
                <input id="uv" type="number" placeholder="5" value={formData.uv} onChange={handleChange} />

                <br />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Crear actividad"}
                </button>
            </form>
        </div>
    );
}

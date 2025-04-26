import { useState } from 'react';

function TarjetaCiudad() {
  const [editando, setEditando] = useState(false);
  const [ciudad, setCiudad] = useState('');
  const [inputCiudad, setInputCiudad] = useState('');
  const [clima, setClima] = useState('');

  const manejarGuardar = async () => {
    try {
      const res = await fetch('http://localhost:3000/clima_por_ciudad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciudad: inputCiudad }),
      });

      if (!res.ok) throw new Error('Error en la API');

      const datos = await res.json();
      setCiudad(datos.ciudad);
      setClima(`Clima: ${datos.descripcion}, ${datos.temperatura}°C`);
      setEditando(false);
    } catch (err) {
      console.error(err);
      setClima('No se pudo obtener el clima.');
    }
  };

  return (
    <div
      className="p-3 mb-3 rounded shadow-sm"
      style={{ backgroundColor: '#f0f8ff', cursor: 'pointer' }}
    >
      {!editando ? (
        <div onClick={() => setEditando(true)}>
          <h5>Aquí puedes ingresar tu ciudad de interés</h5>
          <p>{ciudad || 'Sin ciudad asignada'}</p>
          {clima && <p>{clima}</p>}
        </div>
      ) : (
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Escribe tu ciudad"
            value={inputCiudad}
            onChange={(e) => setInputCiudad(e.target.value)}
          />
          <button className="btn btn-sm btn-success me-2" onClick={manejarGuardar}>
            Guardar
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setEditando(false)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default TarjetaCiudad;


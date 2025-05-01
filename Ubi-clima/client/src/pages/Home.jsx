import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import Card from '../components/Card';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();  // Hook para redirigir

  // Array de las tarjetas
  const cards = [
    { id: 1, title: "Salir a Trotar", description: "", price: "" },
    { id: 2, title: "a", description: "", price: "" },
    { id: 3, title: "b", description: "", price: "" },
    { id: 4, title: "c", description: "", price: "" },
    { id: 5, title: "d", description: "", price: "" },
    { id: 6, title: "e", description: "", price: "" },
    { id: 7, title: "f", description: "", price: "" },
    { id: 8, title: "g", description: "", price: "" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);  // Si hay token, el usuario está logueado
  }, []);

  const handleLoginRedirect = () => {
    navigate('/login');  // Redirige al usuario a la página de login
  };

  return (
    <div className="p-4 rounded shadow" style={{ backgroundColor: '#f0f8ff', minHeight: '1000vh' }}>
      {isLogged ? (
        <>
          <h1>¡Bienvenido de nuevo!</h1>
          <p>Aquí están las actividades disponibles para ti:</p>
          <div className="row row-cols-4 row-cols-md-3 row-cols-lg-4 g-5 mt-4">
            {cards.map(card => (
              <div key={card.id} className="col">
                <Card 
                  title={card.title}
                  description={card.description}
                  price={card.price}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>¡Bienvenido a nuestra página!</h1>
          <p>Para empezar, por favor inicia sesión.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={handleLoginRedirect}  // Llama a la función para redirigir al login
          >
            Iniciar sesión
          </button>
        </>
      )}
    </div>
  );
}


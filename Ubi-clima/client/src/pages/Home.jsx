import Card from '../components/Card';

export default function Home() {
  const cards = [
    {
      id: 1,
      title: "Salir a Trotar",
      description: "",
      price: "",
    },
    {
      id: 2,
      title: "a",
      description: "",
      price: "",
    },
    {
      id: 3,
      title: "b",
      description: "",
      price: "",
    },
    {
      id: 4,
      title: "c",
      description: "",
      price: "",
    },
    {
      id: 5,
      title: "d",
      description: "",
      price: "",
    },
    {
      id: 6,
      title: "e",
      description: "",
      price: "",
    },
    {
      id: 7,
      title: "f",
      description: "",
      price: "",
    },
    {
      id: 8,
      title: "g",
      description: "",
      price: "",
    },
  ];

   return (
    <div className="container py-5" style={{ backgroundColor: '#e6ffe6', minHeight: '1000vh' }}>
      <h1>Esta es la Home</h1>

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
    </div>
  );
}

export default function Card({ title, description, price }) {
  return (
    <div 
      className="card" 
      style={{ width: '18rem', transition: 'transform 0.3s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text fw-bold">{price}</p>
      </div>
    </div>
  );
}


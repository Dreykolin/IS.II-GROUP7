function Boton({ onClick, texto, className = "" }) {
  return (
    <button onClick={onClick} className={className}>
      {texto}
    </button>
  );
}

export default Boton;

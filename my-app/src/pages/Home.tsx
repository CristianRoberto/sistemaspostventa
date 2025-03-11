import { Link } from "react-router-dom";
import "../App.css";

const Home: React.FC = () => {
  return (
    <div className="container">
      {/* Menú lateral */}

      {/* Contenido principal */}
      <div className="content">
        <h2>Bienvenido a Home</h2>
        <p>Accede a tu cuenta o regístrate.</p>
        <Link to="/login">Login</Link> | <Link to="/register">Registro</Link>
      </div>
    </div>
  );
};

export default Home;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Importamos Axios
import "../css/Registro.css";

const Register = () => {
  const [cedula, setCedula] = useState("");
  const [nombre_usuario, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para validar correo
  const validarCorreo = (email: string) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(email);
  };

  // Función para validar contraseña (mínimo 6 caracteres)
  const validarContrasena = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);

    // Validaciones antes de enviar la petición
    if (!nombre_usuario || !correo || !contrasena || !rol) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validarCorreo(correo)) {
      setError("El correo no es válido");
      return;
    }

    if (!validarContrasena(contrasena)) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const userData = { cedula, nombre_usuario, correo, contrasena, rol };

    console.log("Enviando datos de registro:", userData); // Depuración

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/register", userData);
    
      console.log("✅ Respuesta del servidor:", response.data);
    
      if (response.status === 201) {
        alert("Usuario registrado con éxito. Redirigiendo al login...");
        navigate("/login"); // Redirigir tras el registro exitoso
      } else {
        setError(response.data.error || "Error desconocido"); 
      }
    } catch (err: any) {
      console.error("❌ Error al registrar usuario:", err);
    
      if (err.response) {
        setError(err.response.data.error || "Error en la respuesta del servidor");
      } else if (err.request) {
        setError("No se recibió respuesta del servidor");
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="register-form">
      <h1>Registro Usuario</h1>
      <br />

      <div className="containerSecundarioLogin">
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="usuarioForm">
          <input
            type="text"
            placeholder="Cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
            className="form-control"
          />
             <input
            type="text"
            placeholder="Nombre"
            value={nombre_usuario}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="form-control"
          />
          <input
            type="text"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            className="form-control"
          />

          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
            className="form-control"
          >
            <option value="" disabled>Seleccionar rol</option>
            <option value="cajero">Cajero</option>
            <option value="otro">Otro</option>
          </select>

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            className="form-control"
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "REGISTRARSE"}
          </button>
        </form>

        <br />
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

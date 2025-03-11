import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { TextField, InputAdornment } from "@mui/material";
import { Lock, Email } from "@mui/icons-material";

const cookies = new Cookies();

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de validación para los inputs
  const [correoError, setCorreoError] = useState<string | null>(null);
  const [contrasenaError, setContrasenaError] = useState<string | null>(null);

  // Expresión regular para validar correos
  const validarCorreo = (correo: string) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  };

  // Validar contraseña (mínimo 6 caracteres)
  const validarContrasena = (password: string) => password.length >= 6;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validaciones en tiempo real
    if (name === "correo") {
      setCorreoError(validarCorreo(value) ? null : "Correo inválido.");
    }
    if (name === "contrasena") {
      setContrasenaError(validarContrasena(value) ? null : "Mínimo 6 caracteres.");
    }
  };

  const iniciarSesion = async () => {
    setError(null);
    setLoading(true);

    // Validaciones antes de enviar
    if (!form.correo || !form.contrasena) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    if (!validarCorreo(form.correo)) {
      setError("El correo ingresado no es válido.");
      setLoading(false);
      return;
    }

    if (!validarContrasena(form.contrasena)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        correo: form.correo,
        contrasena: form.contrasena,
      });

      if (response.status === 200) {
        const userData = response.data.usuario;

        // Guardar los datos del usuario en cookies
        cookies.set("id", userData.id, { path: "/" });
        cookies.set("correo", userData.correo, { path: "/" });
        cookies.set("rol", userData.rol, { path: "/" });

        // Guardar usuario en localStorage
        const usuario = { usuario: userData, rol: userData.rol };
        localStorage.setItem("UsuarioSesion", JSON.stringify(usuario));

        alert(`Bienvenido ${userData.correo}`);
        window.location.href = "./home";
      } else {
        setError("El usuario o la contraseña son incorrectos.");
      }
    } catch (error: any) {
      console.error("❌ Error en el login:", error);

      if (error.response) {
        setError(error.response.data.error || "Credenciales incorrectas.");
      } else if (error.request) {
        setError("No se pudo conectar con el servidor.");
      } else {
        setError("Error desconocido. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cookies.get("identificacionusuario")) {
      window.location.href = "./menu";
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <TextField
            label="Correo"
            type="text"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            fullWidth
            required
            error={!!correoError}
            helperText={correoError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>

        <div className="form-group">
          <TextField
            label="Contraseña"
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            fullWidth
            required
            error={!!contrasenaError}
            helperText={contrasenaError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>

        <button className="btn btn-primary" onClick={iniciarSesion} disabled={loading}>
          {loading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
        </button>

        <div className="register-button-container">
          <button
            onClick={() => navigate("/register")}
            className="btn btn-register"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              backgroundColor: hover ? "rgb(0, 136, 255)" : "#343a40",
              color: hover ? "#343a40" : "white",
            }}
          >
            <i className="bi bi-person-plus"></i> CREAR CUENTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

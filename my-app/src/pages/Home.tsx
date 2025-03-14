import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../css/Home.css";
import { Typography } from "@mui/material";


const Home: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("UsuarioSesion");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser).usuario);
    }
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="content" style={{ margin: '0 auto', background: 'white', borderRadius: '50px' }} >



          {/* Contenido dentro de la tarjeta */}
          {usuario ? (
            <div className="profile-card" style={{background:'', color:'#6a11cb'}}>
              <div className="profile-info">


                <Typography>
                  <h1 style={{
                    fontWeight: '600',
                    // textTransform: 'uppercase',
                    background: 'linear-gradient(45deg, #6a11cb, #2575fc)', // Degradado suave
                    WebkitBackgroundClip: 'text', // Aplica el gradiente solo al texto
                    color: 'transparent', // Hace el texto transparente para que solo se vea el gradiente
                    width: '100%',
                    margin: '0 auto',
                    borderRadius: '50px',
                    textAlign: 'center', // Asegura que el texto esté centrado
                  }}>
                    Bienvenido a tu perfil
                  </h1>


                  <h1
                    style={{
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      background: 'linear-gradient(45deg, #6a11cb, #2575fc)', // Degradado suave
                      WebkitBackgroundClip: 'text', // Aplica el gradiente solo al texto
                      color: 'transparent', // Hace el texto transparente para que solo se vea el gradiente
                      width: '100%',
                      margin: '0 auto',
                      borderRadius: '50px',
                      textAlign: 'center', // Asegura que el texto esté centrado
                      padding: '20px', // Agrega un poco de espacio dentro de la tarjeta
                    }}
                  >
                    {usuario ? usuario.nombre : 'Invitado'} 
                  </h1>

                </Typography>




                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Rol:</strong> {usuario.rol}</p>
                {/* <p><strong>Empleado ID:</strong> {usuario.empleado_id || "No asignado"}</p> */}
              </div>
              {/* <Link to="/editar-perfil" className="btn btn-edit-profile">Editar Perfil</Link> */}
            </div>
          ) : (
            <div className="auth-links">
              <p>Accede a tu cuenta o regístrate para continuar.</p>
              <Link to="/login" className="btn btn-login">Login</Link> | <Link to="/register" className="btn btn-register">Registro</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

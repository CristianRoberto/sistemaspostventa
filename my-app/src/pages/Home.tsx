import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "../css/Home.css";
import { Typography } from "@mui/material";
import cajeroImg from '../assets/cajero.jpg'; // Asegúrate de usar el nombre correcto del archivo

import adminImg from '../assets/admin.png'; // Asegúrate de usar el nombre correcto del archivo



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

            <div className="profile-card" style={{ background: '', color: '#6a11cb' }}>
              <div className="profile-info">
                <Typography>

                  {/* Imagen para cajero */}
                  {usuario.rol?.toLowerCase().trim() === 'cajero' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <img
                        src={cajeroImg}
                        alt="Foto de cajero"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </div>
                  )}

                  {/* Imagen para admin */}
                  {usuario.rol?.toLowerCase().trim() === 'admin' && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <img
                        src={adminImg}
                        alt="Foto de administrador"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                    </div>
                  )}

                  <h1
                    style={{
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      width: '100%',
                      margin: '20px auto 0',
                      borderRadius: '50px',
                      textAlign: 'center',
                      padding: '20px',
                    }}
                  >
                    {usuario ? usuario.nombre : 'Invitado'}
                  </h1>
                </Typography>

                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Rol:</strong> {usuario.rol}</p>
              </div>
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

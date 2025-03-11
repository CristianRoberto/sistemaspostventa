import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const IngresarEmpleado = () => {
  const [empleado, setEmpleado] = useState({
    nombre: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    email: "",
    direccion: "",
    puesto: "",
    salario: "",
    // imagenempleado: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setEmpleado({
      ...empleado,
      [e.target.name]: e.target.value,
    });
    console.log("Campo cambiado:", e.target.name, "Valor:", e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Datos del empleado a enviar:", empleado); // Depuración de los datos antes de enviarlos
  
    try {
      const response = await axios.post("http://localhost:5000/empleado/", empleado);
      console.log("Respuesta del servidor:", response); // Depuración de la respuesta de la API
      setMensaje("Empleado registrado correctamente.");
      setEmpleado({
        nombre: "",
        apellidos: "",
        cedula: "",
        telefono: "",
        email: "",
        direccion: "",
        puesto: "",
        salario: ""
      });
    } catch (err) {
      console.error("Error al registrar empleado:", err); // Depuración en caso de error
  
      // Verifica si el error tiene una respuesta (en caso de que sea un error de backend)
      if (err.response && err.response.data && err.response.data.error) {
        // Mostrar el error específico que envió el backend
        setError(err.response.data.error);
      } else {
        // Si no hay un error específico, mostrar un mensaje genérico
        setError("Hubo un error al registrar el empleado.");
      }
    }
  };
  

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
          Registrar Nuevo Empleado
        </Typography>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={empleado.nombre}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Apellidos */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={empleado.apellidos}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Cédula */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cédula"
                name="cedula"
                value={empleado.cedula}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={empleado.telefono}
                onChange={handleChange}
              />
            </Grid>

            {/* Correo Electrónico */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                value={empleado.email}
                onChange={handleChange}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={empleado.direccion}
                onChange={handleChange}
              />
            </Grid>

            {/* Puesto */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puesto"
                name="puesto"
                value={empleado.puesto}
                onChange={handleChange}
              />
            </Grid>

            {/* Salario */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salario"
                name="salario"
                value={empleado.salario}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Imagen */}
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Imagen"
                name="imagenempleado"
                value={empleado.imagenempleado}
                onChange={handleChange}
              />
            </Grid> */}
          </Grid>

          {/* Botón Guardar */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="botonguardar"

            fullWidth
            style={{ marginTop: "20px", fontWeight: 600 }}
          >
            Guardar Nuevo Empleado
          </Button>
        </form>
      </Paper>

      {/* Mostrar mensajes de éxito o error */}
      <Snackbar
        open={mensaje !== "" && !mensaje.includes("error")}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setMensaje("")} severity="success">
          {mensaje}
        </Alert>
      </Snackbar>

      {/* Mostrar error en caso de fallo */}
      <Snackbar
        open={error !== ""}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IngresarEmpleado;

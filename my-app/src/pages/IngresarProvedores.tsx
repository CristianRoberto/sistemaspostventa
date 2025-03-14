import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const IngresarProvedores: React.FC = () => {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    apellidos_proveedor : "",
    tipo_proveedor: "",
    ruc_cif: "",
    telefono: "",
    correo_electronico: "",
    direccion_fisica: "",
    persona_contacto: "",
    telefono_contacto: "",
    plazo_pago: "",
    metodo_pago: "",
    moneda: "",
    descuento_volumen: "",
    condiciones_entrega: "",
    fecha_ultimo_pedido: "",
    monto_total_compras: "",
    estado: "",
    calificacion: "",
    historico_devoluciones: "",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setProveedor({
      ...proveedor,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");  // Limpiar cualquier mensaje anterior

    // Validación básica de campos obligatorios
    if (!proveedor.nombre || !proveedor.ruc_cif || !proveedor.telefono) {
      setError("Los campos Nombre, RUC/CIF y Teléfono son obligatorios.");
      setMensaje("error: Los campos Nombre, RUC/CIF y Teléfono son obligatorios.");
      return;
    }

    // Validación del teléfono (Celular) - 10 dígitos
    // Validación del Teléfono - exactamente 10 dígitos
    if (proveedor.telefono.length !== 10) {
      setError("El teléfono debe tener exactamente 10 dígitos.");
      setMensaje("error: El teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    // Validación del RUC / CIF - 11 dígitos
    // Validación del RUC / CIF - entre 10 y 13 dígitos
    if (proveedor.ruc_cif.length < 10 || proveedor.ruc_cif.length > 13) {
      setError("El RUC/CIF debe tener entre 10 y 13 dígitos.");
      setMensaje("error: El RUC/CIF debe tener entre 10 y 13 dígitos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/proveedor", proveedor);
      console.log("Proveedor registrado:", response.data);
      setMensaje(`Proveedor "${proveedor.nombre}" registrado con éxito`);  // Mensaje de éxito con nombre del proveedor
      setError("");  // Limpiar el mensaje de error si el registro es exitoso
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Error al registrar el proveedor. Verifica los datos.";
        setError(errorMessage);  // Mostrar error específico
        setMensaje("error: " + errorMessage);  // Mostrar mensaje de error
      } else {
        console.error("Error desconocido:", error);
        setError("Error al registrar el proveedor. Verifica los datos.");
        setMensaje("error: Error al registrar el proveedor. Verifica los datos.");
      }
    }
  };


  return (
    <Container >
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
          Registrar Nuevo Proveedor
        </Typography>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

<br></br>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={proveedor.nombre}
                onChange={handleChange}
                required
              />
            </Grid>

              {/* Apellidos */}
              <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos_proveedor"
                value={proveedor.apellidos_proveedor}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Tipo Proveedor */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Proveedor</InputLabel>
                <Select
                  name="tipo_proveedor"
                  value={proveedor.tipo_proveedor}
                  onChange={handleChange}
                  label="Tipo de Proveedor"
                >
                  <MenuItem value="Nacional">Nacional</MenuItem>
                  <MenuItem value="Internacional">Internacional</MenuItem>
                  <MenuItem value="Distribuidor">Distribuidor</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* RUC / CIF */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="RUC / CIF"
                name="ruc_cif"
                value={proveedor.ruc_cif}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={proveedor.telefono}
                onChange={handleChange}
              />
            </Grid>

            {/* Correo Electrónico */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo_electronico"
                value={proveedor.correo_electronico}
                onChange={handleChange}
              />
            </Grid>

            {/* Dirección Física */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Dirección Física"
                name="direccion_fisica"
                value={proveedor.direccion_fisica}
                onChange={handleChange}
              />
            </Grid>

            {/* Persona de Contacto */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Persona de Contacto"
                name="persona_contacto"
                value={proveedor.persona_contacto}
                onChange={handleChange}
              />
            </Grid>

            {/* Teléfono de Contacto */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Teléfono de Contacto"
                name="telefono_contacto"
                value={proveedor.telefono_contacto}
                onChange={handleChange}
              />
            </Grid>

            {/* Plazo de Pago */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Plazo de Pago"
                name="plazo_pago"
                value={proveedor.plazo_pago}
                onChange={handleChange}
              />
            </Grid>

            {/* Método de Pago */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  name="metodo_pago"
                  value={proveedor.metodo_pago}
                  onChange={handleChange}
                  label="Método de Pago"
                >
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Moneda */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  name="moneda"
                  value={proveedor.moneda}
                  onChange={handleChange}
                  label="Moneda"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="MXN">MXN</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Condiciones de Entrega */}
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel>Condiciones de Entrega</InputLabel>
                <Select
                  name="condiciones_entrega"
                  value={proveedor.condiciones_entrega}
                  onChange={handleChange}
                  label="Condiciones de Entrega"
                >
                  <MenuItem value="Entrega inmediata">Entrega inmediata</MenuItem>
                  <MenuItem value="30 días">30 días</MenuItem>
                  <MenuItem value="60 días">60 días</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
            Guardar Nuevo Proveedor
          </Button>
        </form>
      </Paper>

      {/* Mostrar mensajes de éxito o error */}
      {/* Mostrar mensajes de éxito (solo éxito) */}
      {/* Mostrar solo en caso de éxito */}
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

    </Container>


  );
};

export default IngresarProvedores;

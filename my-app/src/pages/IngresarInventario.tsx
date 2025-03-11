import React, { useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";

const IngresarInventario: React.FC = () => {
  const [inventario, setInventario] = useState({
    producto_id: "",
    cantidad: "",
    tipo_movimiento: "",
    ubicacion: "",
    estado_producto: "",
    precio_unitario: "",
    motivo_movimiento: "",
    empleado_id: "",
    comentario: "",
  });

  const [productos, setProductos] = useState<any[]>([]); // Para almacenar los productos
  const [empleados, setEmpleados] = useState<any[]>([]); // Para almacenar los empleados
  const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito o error
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success"); // Tipo de mensaje

  const location = useLocation();
  const producto = location.state?.productoRegistrado; // Accedemos a los datos del producto

  // Si el producto existe, podemos usar sus datos para llenar el formulario
  useEffect(() => {
    if (producto) {
      setInventario({
        ...inventario,
        producto_id: producto.producto_id, // Aquí asignamos el ID del producto
        // cantidad_actual: producto.cantidad, // Puedes también llenar otros campos si los tienes
        precio_unitario: producto.precio, // Aquí asignamos el precio del producto al campo "precio_unitario"
      });
    }
  }, [producto]);

  // Cargar empleados desde el backend
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("http://localhost:5000/empleado/");
        setEmpleados(response.data); // Guardar los empleados en el estado
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/productos/");
        setProductos(response.data); // Guardar los productos en el estado
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setInventario({
      ...inventario,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Enviando datos del inventario:", inventario); // Muestra el objeto inventario antes de enviarlo

    try {
      const response = await axios.post("http://localhost:5000/inventarios", inventario);

      console.log("Respuesta del servidor:", response); // Muestra la respuesta del servidor

      setMensaje("Inventario ingresado correctamente.");
      setTipoMensaje("success");

      // Limpiar el formulario después de un registro exitoso
      setInventario({
        producto_id: "",
        cantidad: "",
        tipo_movimiento: "",
        ubicacion: "",
        estado_producto: "",
        precio_unitario: "",
        motivo_movimiento: "",
        empleado_id: "",
        comentario: "",
      });

    } catch (error: any) {
      console.error("Error al enviar el inventario:", error); // Muestra el error completo
      if (error.response) {
        console.error("Detalles del error del backend:", error.response?.data); // Muestra detalles específicos del error
        const mensajeError = error.response?.data?.error || error.response?.data?.message || "Error al ingresar el inventario.";
        setMensaje(mensajeError);
      } else {
        setMensaje("Error al ingresar el inventario.");
      }
      setTipoMensaje("error");
    }
  };


  return (
    <Container maxWidth="lg">
      {/* Snackbar para mostrar mensajes de éxito o error */}
      <Snackbar
        open={mensaje !== ""}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setMensaje("")} severity={tipoMensaje}>
          {mensaje}
        </Alert>
      </Snackbar>

      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
          Registrar Nuevo Inventario
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Producto */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Producto</InputLabel>
                <Select
                  name="producto_id"
                  value={inventario.producto_id}
                  onChange={handleChange}
                  label="Producto"
                >
                  {productos.map((producto) => (
                    <MenuItem key={producto.producto_id} value={producto.producto_id}>
                      {producto.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Cantidad */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                value={inventario.cantidad}
                onChange={handleChange}
                required
                type="number"
              />
            </Grid>

            {/* Tipo de Movimiento */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Movimiento</InputLabel>
                <Select
                  name="tipo_movimiento"
                  value={inventario.tipo_movimiento}
                  onChange={handleChange}
                  label="Tipo de Movimiento"
                >
                  <MenuItem value="entrada">Entrada</MenuItem>
                  <MenuItem value="salida">Salida</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación"
                name="ubicacion"
                value={inventario.ubicacion}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Estado del Producto */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Estado del Producto</InputLabel>
                <Select
                  name="estado_producto"
                  value={inventario.estado_producto}
                  onChange={handleChange}
                  label="Estado del Producto"
                >
                  <MenuItem value="nuevo">Nuevo</MenuItem>
                  <MenuItem value="dañado">Dañado</MenuItem>
                  <MenuItem value="usado">Usado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Precio Unitario */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio Unitario"
                name="precio_unitario"
                value={inventario.precio_unitario}
                onChange={handleChange}
                required
                type="number"
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            {/* Motivo de Movimiento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Motivo del Movimiento"
                name="motivo_movimiento"
                value={inventario.motivo_movimiento}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Empleado ID */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Empleado</InputLabel>
                <Select
                  name="empleado_id"
                  value={inventario.empleado_id}
                  onChange={handleChange}
                  label="Empleado"
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.empleado_id} value={empleado.empleado_id}>
                      {empleado.nombre} {empleado.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Comentario */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comentario"
                name="comentario"
                value={inventario.comentario}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          {/* Botón para enviar el formulario */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px", fontWeight: 600 }}

            className="botonguardar"

          >
            Guardar Inventario
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default IngresarInventario;

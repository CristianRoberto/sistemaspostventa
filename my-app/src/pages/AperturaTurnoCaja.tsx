import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Autocomplete } from "@mui/material";
import { format } from "date-fns"; // Importa format


const IngresarTurnoCaja = () => {

  const getLocalDateTime = () => {
    const now = new Date();

    // Obtener el offset de la zona horaria en minutos y ajustarlo
    const timezoneOffset = now.getTimezoneOffset(); // En minutos
    now.setMinutes(now.getMinutes() - timezoneOffset); // Ajusta la fecha a la hora local

    return now.toISOString().slice(0, 16); // Formato compatible con datetime-local
  };


  // Estado inicial con la fecha y hora locales
  const [turnoCaja, setTurnoCaja] = useState({
    fecha_apertura: getLocalDateTime(),
    monto_inicial: "",
    empleado_id: "",
    estado: "abierto",
  });

  const [empleados, setEmpleados] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [turnoCajaRegistrado, setTurnoCajaRegistrado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); // Estado para el empleado seleccionado

  const navigate = useNavigate();

  // Establecer la fecha y hora actual al cargar el componente
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // formato para datetime-local (yyyy-mm-ddThh:mm)
    setTurnoCaja((prevState) => ({
      ...prevState,
      fecha_apertura: formattedDate,
    }));

    // Obtener empleados desde la API
    axios
      .get("http://localhost:5000/empleado")
      .then((response) => {
        console.log("Empleados obtenidos:", response.data); // Agregado para ver la respuesta
        setEmpleados(response.data);
      })
      .catch((error) => {
        setMensaje("Error al obtener los empleados");
        console.error(error);
      });

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurnoCaja({
      ...turnoCaja,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Asignar el empleado seleccionado al campo empleado_id
    if (empleadoSeleccionado) {
      setTurnoCaja({
        ...turnoCaja,
        empleado_id: empleadoSeleccionado.empleado_id, // Asignamos el empleado_id aquí
      });
    }

    // Realizar la solicitud POST usando axios
    axios
      .post("http://localhost:5000/aperturacaja/", turnoCaja)
      .then((response) => {
        console.log("Respuesta del servidor:", response); // Para ver la respuesta completa
        setTurnoCajaRegistrado(response.data);
        setOpenModal(true);
        // Esperar a que el estado se haya actualizado antes de usarlo en el mensaje
        setMensaje(`Turno de caja #${response.data.id} registrado exitosamente`);
      })
      .catch((error) => {
        console.log("Error al realizar la solicitud:", error); // Para ver el error completo
        setMensaje("Error al registrar el turno de caja");
        console.error(error);
      });


  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
          Registrar Nuevo Turno de Caja
        </Typography>
        <br />

        {/* Mostrar mensajes de éxito o error */}
        <Snackbar
          open={mensaje !== ""}
          autoHideDuration={6000}
          onClose={() => setMensaje("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setMensaje("")} severity={mensaje.includes("error") ? "error" : "success"}>
            {mensaje}
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Fecha de Apertura */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Apertura"
                name="fecha_apertura"
                value={turnoCaja.fecha_apertura}
                onChange={handleChange}
                required
                type="datetime-local"
              />

            </Grid>

            {/* Monto Inicial */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto Inicial"
                name="monto_inicial"
                value={turnoCaja.monto_inicial}
                onChange={handleChange}
                required
                type="number"
              />
            </Grid>

            {/* Empleado */}
            <Grid item xs={120} sm={60}>
              <Autocomplete
                options={empleados}
                getOptionLabel={(option) => `${option.empleado_id} - ${option.nombre} - ${option.puesto}`}
                filterOptions={(options, { inputValue }) =>
                  options.filter((empleado) =>
                    (`${empleado.empleado_id} ${empleado.nombre} ${empleado.puesto}`)
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                }
                onChange={(_event, value) => setEmpleadoSeleccionado(value)} // Guarda el empleado seleccionado
                renderInput={(params) => (
                  <TextField {...params} label="Seleccionar Empleado" variant="outlined" sx={{ width: "450px" }} />
                )}
              />
            </Grid>

            {/* Estado */}
            <Grid item xs={12} sm={60}>
              <FormControl fullWidth required>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  id="estado"
                  name="estado"
                  value={turnoCaja.estado}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="abierto">Abierto</MenuItem>
                  <MenuItem value="cerrado">Cerrado</MenuItem>
                </Select>
              </FormControl>
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
            Registrar Turno de Caja
          </Button>
        </form>
      </Paper>

      {/* Modal de confirmación */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle style={{ textAlign: "center" }}>
          Turno de Caja Registrado #{turnoCajaRegistrado?.id}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>



          <Typography variant="body1">
            Fecha de Apertura:{" "}
            {turnoCajaRegistrado?.fecha_apertura
              ? format(new Date(turnoCajaRegistrado.fecha_apertura), "dd/MM/yyyy HH:mm:ss")
              : "No disponible"}
          </Typography>
          <Typography variant="body1">Monto Inicial: {turnoCajaRegistrado?.monto_inicial}</Typography>

          <Typography variant="body1">
            Empleado: {turnoCajaRegistrado?.empleado_id && empleados.find(e => e.empleado_id === turnoCajaRegistrado.empleado_id)?.nombre || "Nombre no disponible"}
          </Typography>


          <Typography variant="body1">Estado: {turnoCajaRegistrado?.estado}</Typography>

          <Box display="flex" justifyContent="space-between" marginTop="20px">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Redirigir a la página correspondiente si es necesario
                navigate("/cierre_caja/historial");
              }}
            >
              Ver Turnos de Caja
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              No, en otro momento
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default IngresarTurnoCaja;

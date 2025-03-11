import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Pagination,
  Typography,
  Grid,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField, InputAdornment } from '@mui/material';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

const Ventas: React.FC = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("cliente"); // Establece "cliente" como criterio inicial
  const [busqueda, setBusqueda] = useState(""); // Campo de búsqueda
  const [pagina, setPagina] = useState(1); // Paginación
  const [mensaje, setMensaje] = useState<string>(""); // Mensaje de feedback
  const [editingRow, setEditingRow] = useState<number | null>(null); // Fila en edición
  const [editedData, setEditedData] = useState<any>({}); // Datos de la venta que se está editando
  const ventasPorPagina = 10; // Ventas por página
  const navigate = useNavigate(); // Navegación

  useEffect(() => {
    // Hacer la solicitud HTTP a la API de ventas
    axios
      .get("http://localhost:5000/ventas")
      .then((response) => {
        console.log("Ventas obtenidas:", response.data); // Verifica los datos obtenidos
        setVentas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener ventas:", error); // Error en caso de fallo
        setMensaje("Hubo un error al obtener las ventas.");
      });
  }, []);

  // Filtrar las ventas según el criterio y la búsqueda
  const ventasFiltradas = ventas.filter((venta) => {
    const valor =
      criterio === "cliente"
        ? venta.cliente?.nombre?.toLowerCase() // Filtra por el nombre del cliente
        : criterio === "empleado"
          ? venta.empleado?.nombre?.toLowerCase() // Filtra por el nombre del empleado
          : criterio === "ruc_cedula"
            ? venta.cliente?.ruc_cedula?.toLowerCase() // Filtra por el ruc_cedula del cliente
            : venta[criterio as keyof typeof venta]; // Para los otros criterios
    return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
  });


  // Función para editar una venta
  const onEdit = (venta: any) => {
    setEditingRow(venta.venta_id);
    setEditedData(venta);
  };

  // Función para guardar los cambios de la venta
  const onSave = (ventaId: number) => {
    axios
      .put(`http://localhost:5000/venta/${ventaId}`, editedData)
      .then(() => {
        setVentas(
          ventas.map((ven) => (ven.venta_id === ventaId ? editedData : ven))
        );
        setMensaje("Venta actualizada con éxito.");
      })
      .catch((error) => {
        console.error("Error al actualizar venta:", error);
        setMensaje("Hubo un error al actualizar la venta.");
      });
    setEditingRow(null);
  };

  // Función para eliminar una venta
  const onDelete = (ventaId: number) => {
    axios
      .delete(`http://localhost:5000/venta/${ventaId}`)
      .then(() => {
        setVentas(ventas.filter((venta) => venta.venta_id !== ventaId));
        setMensaje("Venta eliminada con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar la venta:", error);
        setMensaje("Hubo un error al eliminar la venta.");
      });
  };

  // Función para manejar los cambios en los campos de edición
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
        Buscar Ventas
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Buscar por"
            value={criterio}
            onChange={(e) => {
              setCriterio(e.target.value);
              setBusqueda(""); // Reiniciar búsqueda al cambiar el criterio
              setPagina(1); // Reiniciar paginación
            }}
            variant="outlined"
          >
            <MenuItem value="cliente">Nombre Cliente</MenuItem>
            <MenuItem value="ruc_cedula">RUC / Cédula</MenuItem> {/* Agregado para la búsqueda por ruc_cedula */}
            <MenuItem value="empleado">Empleado</MenuItem> {/* Ahora filtra correctamente por empleado */}
            <MenuItem value="estado">Estado Venta</MenuItem>
            <MenuItem value="fecha">Fecha</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Buscar"
            variant="outlined"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1); // Reiniciar paginación al cambiar la búsqueda
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="bi bi-search" style={{ color: 'gray', fontSize: '20px' }}></i>
                </InputAdornment>
              ),
            }}
            // sx={{
            //   width: "100%",
            //   // "& .MuiOutlinedInput-root": {
            //   //   padding: "0", // Asegura que el padding del input sea el adecuado
  
            //   // },
            //   "& .MuiOutlinedInput-input": {
            //     padding: "0", // Asegura que el padding del input sea el adecuado
            //     boxSizing: "border-box", // Asegura que los estilos respeten el tamaño total
            //     border: "none",
            //   },
            // }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>#Venta</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Descuento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Impuestos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>TotalNeto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>MétodoPago</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>FechaVenta</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {ventasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} sx={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6" color="error">
                    No hay ventas que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              ventasFiltradas
                .slice((pagina - 1) * ventasPorPagina, pagina * ventasPorPagina)
                .map((venta) => (
                  <TableRow key={venta.venta_id}>
                    <TableCell>{venta.venta_id}</TableCell>
                    <TableCell>{venta.cliente ? venta.cliente.nombre : "Sin nombre del cliente"}</TableCell>
                    <TableCell>{venta.empleado ? venta.empleado.nombre : "Sin nombre del empleado"}</TableCell>
                    <TableCell>{venta.total}</TableCell>
                    <TableCell>{venta.descuento}</TableCell>
                    <TableCell>{venta.impuestos}</TableCell>
                    <TableCell>{venta.total_neto}</TableCell>
                    <TableCell>{venta.metodo_pago}</TableCell>
                    <TableCell>{venta.estado}</TableCell>
                    <TableCell>
                      {new Date(venta.fecha).toLocaleString()} {/* Muestra fecha y hora */}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => navigate(`/venta/${venta.venta_id}`)} // Redirige a la página de detalles
                      >
                        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                          Ver detalles
                        </Typography>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(ventasFiltradas.length / ventasPorPagina)}
        page={pagina}
        onChange={(_event, value) => setPagina(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

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
    </div>
  );
};

export default Ventas;

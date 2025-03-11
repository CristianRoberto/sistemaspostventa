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
  TextField,
  InputAdornment
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Inventarios: React.FC = () => {
  const [inventarios, setInventarios] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("producto_id");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState<string>("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const inventariosPorPagina = 10;

  useEffect(() => {
    axios
      .get("http://localhost:5000/inventarios/")
      .then((response) => {
        setInventarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener inventarios:", error);
        setMensaje("Hubo un error al obtener los inventarios.");
      });
  }, []);

  const inventariosFiltrados = inventarios.filter((inventario) => {
    // Si estamos buscando por nombre de producto, buscamos en el nombre
    if (criterio === "producto_id") {
      return inventario.producto?.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    }
    if (criterio === "cedula") {
      return inventario.empleado?.cedula
        ? inventario.empleado.cedula.toLowerCase().includes(busqueda.toLowerCase())
        : false;
    }




    else {
      const valor = inventario[criterio as keyof typeof inventario];
      return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
    }
  });

  const onEdit = (inventario: any) => {
    setEditingRow(inventario.id_inventarios);
    setEditedData(inventario);
  };

  const onSave = (inventarioId: number) => {
    axios
      .put(`http://localhost:5000/inventarios/${inventarioId}`, editedData)
      .then(() => {
        setInventarios(
          inventarios.map((inv) => (inv.id_inventarios === inventarioId ? editedData : inv))

        );

        const productoNombre = editedData.producto?.nombre || "Producto desconocido";  // Obtener nombre del producto
        setMensaje(`Inventario de ${productoNombre} actualizado con éxito.`);
      })
      .catch((error) => {
        console.error("Error al actualizar inventario:", error);
        setMensaje("Hubo un error al actualizar el inventario.");
      });
    setEditingRow(null);
  };

  const onDelete = (inventarioId: number) => {
    const inventario = inventarios.find((inv) => inv.id_inventarios === inventarioId);
    const productoNombre = inventario?.producto?.nombre || "Producto desconocido";  // Obtener nombre del producto

    axios
      .delete(`http://localhost:5000/inventarios/${inventarioId}`)
      .then(() => {
        setInventarios(inventarios.filter((inventario) => inventario.id_inventarios !== inventarioId));
        setMensaje(`Inventario de ${productoNombre} eliminado con éxito.`);
      })
      .catch((error) => {
        console.error("Error al eliminar el inventario:", error);
        setMensaje("Hubo un error al eliminar el inventario.");
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const columnas = [
    'id_inventarios',
    'producto_id',
    'cantidad',
    'tipo_movimiento',
    'fecha_movimiento',
    'ubicacion',
    'estado_producto',
    'precio_unitario',
    'motivo_movimiento',
    'empleado_id',
    'cantidad_actual',
    'referencia_externa',
    'comentario'
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
        Buscar Inventarios
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
              setBusqueda("");
              setPagina(1);
            }}
            variant="outlined"
          >
            <MenuItem value="producto_id">Producto</MenuItem> {/* Filtrar por nombre de producto */}
            <MenuItem value="cedula">Cédula/RUC Empleado</MenuItem>
            <MenuItem value="tipo_movimiento">Tipo Movimiento</MenuItem>
            <MenuItem value="ubicacion">Ubicación</MenuItem>
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
              setPagina(1);
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
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cantidad</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo_Movimiento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha_Movimiento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado_Producto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Precio_Unitario</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Motivo_Movimiento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cantidad_Actual</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Referencia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Comentario</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventariosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} sx={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6" color="error">
                    No hay inventarios que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              inventariosFiltrados
                .slice((pagina - 1) * inventariosPorPagina, pagina * inventariosPorPagina)
                .map((inventario) => (
                  <TableRow key={inventario.id_inventarios}>
                    {columnas.map((campo, index) => (
                      <TableCell key={index}>
                        {campo === "producto_id" ? (
                          inventario.producto ? inventario.producto.nombre : "Producto no encontrado"
                        ) : campo === "empleado_id" ? (
                          inventario.empleado ? inventario.empleado.nombre : "Empleado no encontrado"
                        ) : campo === "fecha_movimiento" ? (
                          // Formato de la fecha de movimiento
                          new Date(inventario.fecha_movimiento).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        ) : editingRow === inventario.id_inventarios ? (
                          <TextField
                            value={editedData[campo] || ""}
                            onChange={(e) => handleInputChange(e, campo)}
                            size="small"
                          />
                        ) : (
                          inventario[campo]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {editingRow === inventario.id_inventarios ? (
                        <IconButton onClick={() => onSave(inventario.id_inventarios)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => onEdit(inventario)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => onDelete(inventario.id_inventarios)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <Pagination
        count={Math.ceil(inventariosFiltrados.length / inventariosPorPagina)}
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

export default Inventarios;

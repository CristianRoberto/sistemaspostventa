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




const Empleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState<string>("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const empleadosPorPagina = 10;

  useEffect(() => {
    axios
      .get("http://localhost:5000/empleado")
      .then((response) => setEmpleados(response.data))
      .catch((error) => {
        console.error("Error al obtener empleados:", error);
        setMensaje("Hubo un error al obtener los empleados.");
      });
  }, []);

  const empleadosFiltrados = empleados.filter((empleado) => {
    const valor = empleado[criterio as keyof typeof empleado];
    return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
  });

  const onEdit = (empleado: any) => {
    setEditingRow(empleado.empleado_id);
    setEditedData(empleado);
  };

  const onSave = (empleadoId: number) => {
    axios
      .put(`http://localhost:5000/empleado/${empleadoId}`, editedData)
      .then(() => {
        setEmpleados(
          empleados.map((emp) => (emp.empleado_id === empleadoId ? editedData : emp))
        );
        setMensaje("Empleado actualizado con éxito.");
      })
      .catch((error) => {
        console.error("Error al actualizar empleado:", error);
        setMensaje("Hubo un error al actualizar el empleado.");
      });
    setEditingRow(null);
  };

  const onDelete = (empleadoId: number) => {
    axios
      .delete(`http://localhost:5000/empleado/${empleadoId}`)
      .then(() => {
        setEmpleados(empleados.filter((empleado) => empleado.empleado_id !== empleadoId));
        setMensaje("Empleado eliminado con éxito.");
        
      })
      .catch((error) => {
        console.error("Error al eliminar el empleado:", error);
        setMensaje("Hubo un error al eliminar el empleado.");
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
        Buscar Empleados
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
            <MenuItem value="cedula">Cédula</MenuItem>
            <MenuItem value="nombre">Nombre</MenuItem>
            <MenuItem value="puesto">Puesto</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8} >
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
           
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cédula</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Apellidos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Puesto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Salario</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {empleadosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6" color="error">
                    No hay empleados que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              empleadosFiltrados
                .slice((pagina - 1) * empleadosPorPagina, pagina * empleadosPorPagina)
                .map((empleado) => (
                  <TableRow key={empleado.empleado_id}>
                    {Object.keys(empleado).map((field, index) => (
                      <TableCell key={index}>
                        {editingRow === empleado.empleado_id ? (
                          <TextField
                            value={editedData[field] || ""}
                            onChange={(e) => handleInputChange(e, field)}
                            size="small"
                          />
                        ) : (
                          empleado[field]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {editingRow === empleado.empleado_id ? (
                        <IconButton onClick={() => onSave(empleado.empleado_id)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => onEdit(empleado)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => onDelete(empleado.empleado_id)}>
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
        count={Math.ceil(empleadosFiltrados.length / empleadosPorPagina)}
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

export default Empleados;

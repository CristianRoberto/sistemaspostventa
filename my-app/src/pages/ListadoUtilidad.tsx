import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Pagination,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";


const ListadoUtilidad = () => {
  const [datos, setDatos] = useState([]);
  const [criterio, setCriterio] = useState("fecha");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const datosPorPagina = 10;

  useEffect(() => {
    axios
      .get("http://localhost:5000/utilidad/")
      .then((response) => setDatos(response.data))
      .catch((error) => {
        console.error("Error al obtener datos de utilidad:", error);
        setMensaje("Hubo un error al obtener los datos de utilidad.");
      });
  }, []);

  const datosFiltrados = datos.filter((item) => {
    const valor = item[criterio];
    return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Snackbar
        open={!!mensaje}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setMensaje("")}>
          {mensaje}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        Resumen de Utilidad Diaria
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Buscar por"
            value={criterio}
            onChange={(e) => setCriterio(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="fecha">Fecha</MenuItem>
            <MenuItem value="ventas">Ventas</MenuItem>
            <MenuItem value="compras">Compras</MenuItem>
            <MenuItem value="utilidad">Utilidad</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Buscar"
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_Ventas</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_Devoluciones</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_Compras</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Utilidad_bruta</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Total_Pagos</TableCell>
              {/* <TableCell>Gastos Operativos</TableCell> */}
              <TableCell sx={{ fontWeight: 600 }}>Utilidad_Diaria</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosFiltrados.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss")}</TableCell>
                <TableCell>{item.ventas}</TableCell>
                <TableCell>{item.devoluciones}</TableCell>
                <TableCell>{item.compras}</TableCell>
                <TableCell>{item.utilidad_bruta}</TableCell>
                <TableCell>{item.pagos_adicionales}</TableCell>
                {/* <TableCell>{item.gastos_operativos}</TableCell> */}
                <TableCell>{item.utilidad_diaria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(datosFiltrados.length / datosPorPagina)}
        page={pagina}
        onChange={(_, value) => setPagina(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />
    </div>
  );
};

export default ListadoUtilidad;

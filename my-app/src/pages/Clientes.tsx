import React, { useState, useEffect, useMemo } from "react";
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
  IconButton,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from 'react-router-dom';


const Clientes: React.FC = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState<string>("");
  const [editingRow, setEditingRow] = useState<number | null>(null); // Controlar la fila seleccionada para edición
  const [editedData, setEditedData] = useState<any>({});
  const [loading, setLoading] = useState(false); // Estado para carga
  const clientesPorPagina = 10;

  // Optimización en la búsqueda
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const valor = cliente[criterio as keyof typeof cliente];
      return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
    });
  }, [clientes, criterio, busqueda]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/clientes") // URL para obtener los clientes
      .then((response) => setClientes(response.data))
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
        setMensaje("Hubo un error al obtener los clientes.");
      })
      .finally(() => setLoading(false)); // Cuando termina la carga
  }, []);

  const onEdit = (cliente: any) => {
    setEditingRow(cliente.cliente_id); // Inicia la edición de esta fila
    setEditedData(cliente); // Carga los datos para editar
  };

  const onSave = (cliente_id: number) => {
    if (!editedData.nombre || !editedData.email) {
      setMensaje("Los campos nombre y email son obligatorios.");
      return;
    }

    setLoading(true);
    axios
      .put(`http://localhost:5000/clientes/${cliente_id}`, editedData)
      .then(() => {
        setClientes(
          clientes.map((cli) => (cli.cliente_id === cliente_id ? editedData : cli))
        );
        setMensaje(`Cliente "${editedData.nombre}" actualizado con éxito.`);
      })
      .catch((error) => {
        console.error("Error al actualizar cliente:", error);
        setMensaje(
          `Hubo un error al actualizar el cliente ${editedData.nombre}: ${error.response?.data?.message || "Error desconocido"}`
        );
      })
      .finally(() => setLoading(false));
    setEditingRow(null);
  };

  const onDelete = (cliente_id: number) => {
    setLoading(true);
    const clienteEliminado = clientes.find((cliente) => cliente.cliente_id === cliente_id);

    axios
      .delete(`http://localhost:5000/clientes/${cliente_id}`)
      .then(() => {
        setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.cliente_id !== cliente_id));
        setMensaje(`Cliente "${clienteEliminado?.nombre || 'Desconocido'}" eliminado con éxito.`);
      })
      .catch((error) => {
        console.error("Error al eliminar el cliente:", error);
        setMensaje(`Hubo un error al eliminar el cliente "${clienteEliminado?.nombre || 'Desconocido'}".`);
      })
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>




      <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
        Buscar Clientes
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
            <MenuItem value="nombre">Nombre</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="telefono">Teléfono</MenuItem>
            <MenuItem value="ruc_cedula">RUC/Cédula</MenuItem>
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
                  <i className="bi bi-search" style={{ color: "gray", fontSize: "20px" }}></i>
                </InputAdornment>
              ),
            }}

          />
        </Grid>
      </Grid>

      {/* Mensaje de carga */}
      {loading && <CircularProgress sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }} />}


      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>Id</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Apellidos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha_Registro</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo_Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>RUC/Cédula</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Método_Preferido</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Última_Compra</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_Compras</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Observaciones</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nivel_de_Satisfacción</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cantidad_Reclamos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Puntos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clientesFiltrados.slice((pagina - 1) * clientesPorPagina, pagina * clientesPorPagina).map((cliente) => (
              <TableRow key={cliente.cliente_id}>
                {/* Colocando los datos explícitamente para que coincidan con las cabeceras */}
                <TableCell>{cliente.cliente_id}</TableCell>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.apellidos}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>

                {/* Formateando la fecha de registro */}
                <TableCell>
                  {new Date(cliente.fecha_registro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </TableCell>

                <TableCell>{cliente.estado}</TableCell>
                <TableCell>{cliente.tipo_cliente}</TableCell>
                <TableCell>{cliente.ruc_cedula}</TableCell>
                <TableCell>{cliente.metodo_preferido}</TableCell>

                {/* Formateando la última compra */}
                <TableCell>
                  {new Date(cliente.ultima_compra).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </TableCell>

                <TableCell>{cliente.total_compras}</TableCell>
                <TableCell>{cliente.observaciones}</TableCell>
                <TableCell>{cliente.nivel_satisfaccion}</TableCell>
                <TableCell>{cliente.cantidad_reclamos}</TableCell>
                <TableCell>{cliente.total_puntos_acumulados}</TableCell>

                {/* Acciones */}
                <TableCell>
                  {editingRow === cliente.cliente_id ? (
                    <IconButton onClick={() => onSave(cliente.cliente_id)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => onEdit(cliente)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => onDelete(cliente.cliente_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Paginación */}
      <Pagination
        count={Math.ceil(clientesFiltrados.length / clientesPorPagina)}
        page={pagina}
        onChange={(_event, value) => setPagina(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      {/* Información sobre la paginación */}
      <Typography variant="body2" sx={{ marginTop: "10px", textAlign: "center" }}>
        Mostrando {clientesFiltrados.length ? (pagina - 1) * clientesPorPagina + 1 : 0} -{" "}
        {Math.min(pagina * clientesPorPagina, clientesFiltrados.length)} de {clientesFiltrados.length}
      </Typography>

      {/* Mensaje de estado */}
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

export default Clientes;

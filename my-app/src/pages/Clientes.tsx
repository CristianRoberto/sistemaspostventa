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
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  InputLabel
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import 'bootstrap-icons/font/bootstrap-icons.css';
import VisibilityIcon from "@mui/icons-material/Visibility";

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState<string>("");  // Mensaje para mostrar en general
  const [mensajeError, setMensajeError] = useState<string>("");  // Mensaje de error
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Estado para el modal de edición
  const clientesPorPagina = 10;

  useEffect(() => {
    axios
      .get("http://localhost:5000/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => {
        console.error("Error al obtener clientes:", error);
        setMensajeError("Hubo un error al obtener los clientes.");
      });
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const valor = cliente[criterio as keyof typeof cliente];
    return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
  });

  const onEdit = (cliente: any) => {
    setEditingRow(cliente.cliente_id);
    setEditedData({ ...cliente });
    setOpenModal(true); // Abrir el modal de edición
  };

  const onSave = (clienteId: number) => {
    axios
      .put(`http://localhost:5000/clientes/${clienteId}`, editedData)
      .then(() => {
        setClientes(clientes.map(cliente =>
          cliente.cliente_id === clienteId ? { ...cliente, ...editedData } : cliente
        ));
        setMensaje("Cliente actualizado con éxito.");
        setOpenModal(false); // Cerrar el modal después de guardar
      })
      .catch((error) => {
        console.error("Error al actualizar cliente:", error);
        setMensajeError("Hubo un error al actualizar el cliente.");
      });
  };

  const onDelete = (clienteId: number) => {
    axios
      .delete(`http://localhost:5000/clientes/${clienteId}`)
      .then(() => {
        setClientes(clientes.filter((cliente) => cliente.cliente_id !== clienteId));
        setMensaje("Cliente eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar el cliente:", error);
        setMensajeError("Hubo un error al eliminar el cliente.");
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const openDetails = (cliente: any) => {
    setOpenDetailsModal(true); // Abrir el modal de detalles
    setEditedData(cliente); // Poner los datos del cliente en el estado para mostrar en el modal
  };

  // Mostrar mensaje de error con Snackbar
  const handleCloseError = () => {
    setMensajeError("");  // Cerrar mensaje de error
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
            <MenuItem value="ruc_cedula">RUC/Cédula</MenuItem>
            <MenuItem value="nombre">Nombre</MenuItem>
            <MenuItem value="tipo_cliente">Tipo Cliente</MenuItem>
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
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Apellidos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>RUC/Cédula</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha_Registro</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_Puntos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clientesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} sx={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6" color="error">
                    No hay clientes que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clientesFiltrados
                .slice((pagina - 1) * clientesPorPagina, pagina * clientesPorPagina)
                .map((cliente) => (
                  <TableRow key={cliente.cliente_id}>
                    <TableCell>{cliente.cliente_id}</TableCell>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.apellidos}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.direccion}</TableCell>
                    <TableCell>{cliente.ruc_cedula}</TableCell>
                    <TableCell>{new Date(cliente.fecha_registro).toLocaleDateString()}</TableCell>
                    <TableCell>{cliente.total_puntos_acumulados}</TableCell>
                    <TableCell sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: 'none'
                    }}>
                      <IconButton
                        onClick={() => onEdit(cliente)}
                        sx={{
                          padding: '0',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                          display: 'inline-flex',
                          width: 'auto',
                          height: 'auto',
                          border: 'none',
                        }}
                      >
                        <EditIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(cliente.cliente_id)}
                        sx={{
                          padding: '0',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                          display: 'inline-flex',
                          width: 'auto',
                          height: 'auto',
                          border: 'none',
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                      <IconButton
                        onClick={() => openDetails(cliente)}
                        sx={{
                          padding: '0',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                          display: 'inline-flex',
                          width: 'auto',
                          height: 'auto',
                          border: 'none',
                        }}
                      >
                        <VisibilityIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <Pagination
        count={Math.ceil(clientesFiltrados.length / clientesPorPagina)}
        page={pagina}
        onChange={(_, value) => setPagina(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      <Snackbar
        open={mensaje !== ""}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setMensaje("")} severity="success" sx={{ width: "100%" }}>
          {mensaje}
        </Alert>
      </Snackbar>

      <Snackbar
        open={mensajeError !== ""}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {mensajeError}
        </Alert>
      </Snackbar>

      {/* Modal de edición */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <InputLabel id="estado-label">Nombres</InputLabel>
          <TextField
            value={editedData.nombre || ""}
            onChange={(e) => handleInputChange(e, "nombre")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!editedData.nombre}
            helperText={!editedData.nombre ? "Este campo es obligatorio" : ""}
          />

          <InputLabel id="estado-label">Apellidos</InputLabel>
          <TextField
            value={editedData.apellidos || ""}
            onChange={(e) => handleInputChange(e, "apellidos")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!editedData.apellidos}
            helperText={!editedData.apellidos ? "Este campo es obligatorio" : ""}
          />

          <InputLabel id="estado-label">Email</InputLabel>
          <TextField
            type="email"
            value={editedData.email || ""}
            onChange={(e) => handleInputChange(e, "email")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!/\S+@\S+\.\S+/.test(editedData.email)}
            helperText={!/\S+@\S+\.\S+/.test(editedData.email) ? "Ingrese un email válido" : ""}
          />
          <TextField
            label="Teléfono"
            type="tel"
            value={editedData.telefono || ""}
            onChange={(e) => handleInputChange(e, "telefono")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!/^\d{7,10}$/.test(editedData.telefono)}
            helperText={!/^\d{7,10}$/.test(editedData.telefono) ? "Ingrese un teléfono válido" : ""}
          />


          <InputLabel id="estado-label">Direccion</InputLabel>
          <TextField
            value={editedData.direccion || ""}
            onChange={(e) => handleInputChange(e, "direccion")}
            fullWidth
            sx={{ marginBottom: "15px" }}
          />

          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            value={editedData.estado || ""}
            onChange={(e) => handleInputChange(e, "estado")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!editedData.estado}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </Select>

          <InputLabel id="tipo-cliente-label">Tipo de Cliente</InputLabel>
          <Select
            labelId="tipo-cliente-label"
            value={editedData.tipo_cliente || ""}
            onChange={(e) => handleInputChange(e, "tipo_cliente")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!editedData.tipo_cliente}
          >
            <MenuItem value="nuevo">Nuevo</MenuItem>
            <MenuItem value="vip">VIP</MenuItem>
            <MenuItem value="frecuente">Frecuente</MenuItem>
          </Select>


          <InputLabel id="estado-label">Cedula_Ruc</InputLabel>
          <TextField
            value={editedData.ruc_cedula || ""}
            onChange={(e) => handleInputChange(e, "ruc_cedula")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={!editedData.ruc_cedula}
            helperText={!editedData.ruc_cedula ? "Este campo es obligatorio" : ""}
          />

          <InputLabel id="estado-label">Método de Contacto Preferido</InputLabel>
          <TextField
            value={editedData.metodo_contacto_preferido || ""}
            onChange={(e) => handleInputChange(e, "metodo_contacto_preferido")}
            fullWidth
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            label="Última Compra"
            type="date"
            value={editedData.ultima_compra || ""}
            onChange={(e) => handleInputChange(e, "ultima_compra")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Total Compras"
            type="number"
            value={editedData.total_compras || ""}
            onChange={(e) => handleInputChange(e, "total_compras")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={editedData.total_compras < 0}
            helperText={editedData.total_compras < 0 ? "El total de compras no puede ser negativo" : ""}
          />

          <InputLabel id="estado-label">Observaciones</InputLabel>
          <TextField
            value={editedData.observaciones || "Sin observaciones"}
            onChange={(e) => handleInputChange(e, "observaciones")}
            fullWidth
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            label="Nivel de Satisfacción"
            type="number"
            value={editedData.nivel_satisfaccion || ""}
            onChange={(e) => handleInputChange(e, "nivel_satisfaccion")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={editedData.nivel_satisfaccion < 1 || editedData.nivel_satisfaccion > 10}
            helperText={(editedData.nivel_satisfaccion < 1 || editedData.nivel_satisfaccion > 10) ? "Debe estar entre 1 y 10" : ""}
          />
          <TextField
            label="Cantidad de Reclamos"
            type="number"
            value={editedData.cantidad_reclamos || ""}
            onChange={(e) => handleInputChange(e, "cantidad_reclamos")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={editedData.cantidad_reclamos < 0}
            helperText={editedData.cantidad_reclamos < 0 ? "No puede ser un valor negativo" : ""}
          />
          <TextField
            label="Total Puntos Acumulados"
            type="number"
            value={editedData.total_puntos_acumulados || ""}
            onChange={(e) => handleInputChange(e, "total_puntos_acumulados")}
            fullWidth
            sx={{ marginBottom: "15px" }}
            required
            error={editedData.total_puntos_acumulados < 0}
            helperText={editedData.total_puntos_acumulados < 0 ? "No puede ser un valor negativo" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary" variant="contained">
            Cancelar
          </Button>
          <Button
            onClick={() => onSave(editedData.cliente_id)}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={
              !editedData.nombre ||
              !editedData.apellidos ||
              !/\S+@\S+\.\S+/.test(editedData.email) ||
              !/^\d{7,15}$/.test(editedData.telefono) ||
              !editedData.ruc_cedula ||
              !editedData.estado ||
              !editedData.tipo_cliente ||
              editedData.total_compras < 0 ||
              editedData.nivel_satisfaccion < 1 ||
              editedData.nivel_satisfaccion > 10 ||
              editedData.cantidad_reclamos < 0 ||
              editedData.total_puntos_acumulados < 0
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>





      {/* Modal de Detalles */}
      <Dialog
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '20px',

            margin: '0 auto'
          },
          '& .MuiDialogTitle-root': {
            fontSize: '1.25rem',
            color: '#333',

          },
          '& .MuiDialogContent-root': {
            fontSize: '1rem',
            color: '#555',
            margin: '0 auto',

            textAlign: 'center'

          },
          '& .MuiDialogActions-root': {
            borderTop: '1px solid #ddd',

          },
        }}
      >
        <DialogTitle style={{ fontWeight: 600 }}>Detalles del Cliente</DialogTitle>
        <DialogContent>
          {editedData && (
            <div>
              <Typography variant="h6" sx={{ fontWeight: '500' }}>
                Nombre: {editedData.nombre}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: '500' }}>
                Apellidos: {editedData.apellidos}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: '500' }}>
                Email: {editedData.email}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: '500' }}>
                Teléfono: {editedData.telefono}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: '500' }}>
                Dirección: {editedData.direccion}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Fecha de Registro: {new Date(editedData.fecha_registro).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Estado: {editedData.estado}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Tipo de Cliente: {editedData.tipo_cliente}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                RUC/Cédula: {editedData.ruc_cedula}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Método de Contacto Preferido: {editedData.metodo_contacto_preferido}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Última Compra: {editedData.ultima_compra}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Total Compras: {editedData.total_compras}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Observaciones: {editedData.observaciones}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Nivel de Satisfacción: {editedData.nivel_satisfaccion}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Cantidad de Reclamos: {editedData.cantidad_reclamos}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                Total Puntos Acumulados: {editedData.total_puntos_acumulados}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsModal(false)} color="primary" variant="contained" sx={{ fontWeight: '500' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
};

export default Clientes;

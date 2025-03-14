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
  IconButton,
  InputAdornment,
  Modal,
  Box,
  Dialog,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState<string>("");
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [selectedProveedor, setSelectedProveedor] = useState<any | null>(null); // Estado para el modal
  const proveedoresPorPagina = 10;

  useEffect(() => {
    axios
      .get("http://localhost:5000/proveedor/")
      .then((response) => setProveedores(response.data))
      .catch((error) => {
        console.error("Error al obtener proveedores:", error);
        setMensaje("Hubo un error al obtener los proveedores.");
      });
  }, []);

  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const valor = proveedor[criterio as keyof typeof proveedor];
    return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
  });

  const onEdit = (proveedor: any) => {
    setEditingRow(proveedor.id_proveedores);
    setEditedData(proveedor);
  };

  const onSave = (id: string) => {
    axios
      .put(`http://localhost:5000/proveedor/${id}`, editedData)
      .then(() => {
        setProveedores(
          proveedores.map((prov) =>
            prov.id_proveedores === id ? editedData : prov
          )
        );
        setMensaje("Proveedor actualizado con éxito.");
        setEditingRow(null);
      })
      .catch((error) => {
        console.error("Error al actualizar proveedor:", error);
        setMensaje("Hubo un error al actualizar el proveedor.");
      });
  };

  const onDelete = (id: string) => {
    axios
      .delete(`http://localhost:5000/proveedor/${id}`)
      .then(() => {
        setProveedores(
          proveedores.filter((proveedor) => proveedor.id_proveedores !== id)
        );
        setMensaje("Proveedor eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar el proveedor:", error);
        setMensaje("Hubo un error al eliminar el proveedor.");
      });
  };

  const openDetailsModal = (proveedor: any) => {
    setSelectedProveedor(proveedor);
  };

  const closeDetailsModal = () => {
    setSelectedProveedor(null);
  };

  // Handle changes in the input fields for editing
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Snackbar
        open={!!mensaje}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setMensaje("")} severity="success" sx={{ width: "100%" }}>
          {mensaje}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
        Buscar Proveedores
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
            <MenuItem value="ruc">RUC</MenuItem>
            <MenuItem value="correo">Correo</MenuItem>
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

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Apellidos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>RUC</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {proveedoresFiltrados.map((proveedor) => (
              <TableRow key={proveedor.id_proveedores}>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.apellidos_proveedor}</TableCell>
                <TableCell>{proveedor.ruc_cif}</TableCell>
                <TableCell>{proveedor.correo_electronico}</TableCell>
                <TableCell>
                  {editingRow === proveedor.id_proveedores ? (
                    <IconButton
                      onClick={() => onSave(proveedor.id_proveedores)}
                      sx={{
                        padding: "0",
                        "&:hover": { backgroundColor: "transparent" },
                        display: "inline-flex",
                        width: "auto",
                        height: "auto",
                      }}
                    >
                      <SaveIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => onEdit(proveedor)}
                      sx={{
                        padding: "0",
                        "&:hover": { backgroundColor: "transparent" },
                        display: "inline-flex",
                        width: "auto",
                        height: "auto",
                      }}
                    >
                      <EditIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                  )}

                  <IconButton
                    onClick={() => onDelete(proveedor.id_proveedores)}
                    sx={{
                      padding: "0",
                      "&:hover": { backgroundColor: "transparent" },
                      display: "inline-flex",
                      width: "auto",
                      height: "auto",
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 30, }} />
                  </IconButton>

                  <IconButton
                    onClick={() => openDetailsModal(proveedor)}
                    sx={{
                      padding: "0",
                      "&:hover": { backgroundColor: "transparent" },
                      display: "inline-flex",
                      width: "auto",
                      height: "auto",
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(proveedoresFiltrados.length / proveedoresPorPagina)}
        page={pagina}
        onChange={(_, value) => setPagina(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      {/* Modal de detalles */}
      {/* Dialog para detalles del proveedor */}
      <Dialog
        open={!!selectedProveedor}
        onClose={closeDetailsModal}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          },
        }}
      >
        <DialogTitle style={{ fontWeight: 600 }}>Detalles del Proveedor</DialogTitle>
        <DialogContent>
          {selectedProveedor &&
            Object.entries(selectedProveedor).map(([key, value]) => (
              <Typography key={key} variant="body1">
                <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {String(value)}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsModal} color="primary" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de editar proveedor */}
      <Dialog
        open={editingRow !== null}
        onClose={() => setEditingRow(null)}
        fullWidth
      >
        <DialogTitle>Editar Proveedor</DialogTitle>
        <DialogContent>
        <br></br>

          {editingRow && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={editedData.nombre}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  name="apellidos_proveedor"
                  value={editedData.apellidos_proveedor}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tipo Proveedor"
                  name="tipo_proveedor"
                  value={editedData.tipo_proveedor}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="RUC"
                  name="ruc_cif"
                  value={editedData.ruc_cif}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo"
                  name="correo_electronico"
                  value={editedData.correo_electronico}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={editedData.telefono}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección Física"
                  name="direccion_fisica"
                  value={editedData.direccion_fisica}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Persona de Contacto"
                  name="persona_contacto"
                  value={editedData.persona_contacto}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono de Contacto"
                  name="telefono_contacto"
                  value={editedData.telefono_contacto}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Plazo de Pago"
                  name="plazo_pago"
                  value={editedData.plazo_pago}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Método de Pago"
                  name="metodo_pago"
                  value={editedData.metodo_pago}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Moneda"
                  name="moneda"
                  value={editedData.moneda}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descuento por Volumen"
                  name="descuento_volumen"
                  value={editedData.descuento_volumen}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Condiciones de Entrega"
                  name="condiciones_entrega"
                  value={editedData.condiciones_entrega}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fecha de Último Pedido"
                  name="fecha_ultimo_pedido"
                  value={editedData.fecha_ultimo_pedido}
                  onChange={handleEditChange}
                  variant="outlined"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Monto Total de Compras"
                  name="monto_total_compras"
                  value={editedData.monto_total_compras}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="estado"
                  value={editedData.estado}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Calificación"
                  name="calificacion"
                  value={editedData.calificacion}
                  onChange={handleEditChange}
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Histórico de Devoluciones"
                  name="historico_devoluciones"
                  value={editedData.historico_devoluciones}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditingRow(null)}
           variant="contained"
              color="secondary"
            >
            Cancelar
          </Button>
          <Button onClick={() => onSave(editingRow as string)} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Proveedores;

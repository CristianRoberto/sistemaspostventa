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
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from 'date-fns';

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState<string>("");
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
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
          proveedores.map((prov) => (prov.id_proveedores === id ? editedData : prov))
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
        setProveedores(proveedores.filter((proveedor) => proveedor.id_proveedores !== id));
        setMensaje("Proveedor eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar el proveedor:", error);
        setMensaje("Hubo un error al eliminar el proveedor.");
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>

      <Snackbar
        open={!!mensaje}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}

      >
        <Alert
          onClose={() => setMensaje("")}
          severity="success"
          sx={{ width: "100%" }}
        >
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
            <MenuItem value="tipo_proveedor">Tipo Proveedor</MenuItem>
            <MenuItem value="ruc_cif">RUC / CIF</MenuItem>
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
              <TableCell sx={{ fontWeight: 600 }}>Tipo_Proveedor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>RUC/CIF</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Correo_Electrónico</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dirección_Física</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Persona_Contacto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Teléfono_Contacto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plazo_de_Pago</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Método_de_Pago</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Moneda</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Descuento_por_Volumen</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Condiciones_de_Entrega</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha_Último_Pedido</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Monto_Total_Compras</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Calificación</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Histórico_Devoluciones</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Creado_En</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actualizado_En</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {proveedoresFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={22} sx={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6" color="error">
                    No hay Provedores que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              proveedoresFiltrados
                .slice((pagina - 1) * proveedoresPorPagina, pagina * proveedoresPorPagina)
                .map((proveedor) => (
                  <TableRow key={proveedor.id_proveedores}>
                    <TableCell>{proveedor.id_proveedores}</TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.nombre || ""}
                          onChange={(e) => handleInputChange(e, "nombre")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.nombre
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.tipo_proveedor || ""}
                          onChange={(e) => handleInputChange(e, "tipo_proveedor")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.tipo_proveedor
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.ruc_cif || ""}
                          onChange={(e) => handleInputChange(e, "ruc_cif")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.ruc_cif
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.telefono || ""}
                          onChange={(e) => handleInputChange(e, "telefono")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.telefono
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.correo_electronico || ""}
                          onChange={(e) => handleInputChange(e, "correo_electronico")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.correo_electronico
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.direccion_fisica || ""}
                          onChange={(e) => handleInputChange(e, "direccion_fisica")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.direccion_fisica
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.persona_contacto || ""}
                          onChange={(e) => handleInputChange(e, "persona_contacto")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.persona_contacto
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.telefono_contacto || ""}
                          onChange={(e) => handleInputChange(e, "telefono_contacto")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.telefono_contacto
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.plazo_pago || ""}
                          onChange={(e) => handleInputChange(e, "plazo_pago")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.plazo_pago
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.metodo_pago || ""}
                          onChange={(e) => handleInputChange(e, "metodo_pago")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.metodo_pago
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.moneda || ""}
                          onChange={(e) => handleInputChange(e, "moneda")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.moneda
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.descuento_volumen || ""}
                          onChange={(e) => handleInputChange(e, "descuento_volumen")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.descuento_volumen
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.condiciones_entrega || ""}
                          onChange={(e) => handleInputChange(e, "condiciones_entrega")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.condiciones_entrega
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.fecha_ultimo_pedido || ""}
                          onChange={(e) => handleInputChange(e, "fecha_ultimo_pedido")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.fecha_ultimo_pedido ? format(new Date(proveedor.fecha_ultimo_pedido), 'dd/MM/yyyy') : ""
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.monto_total_compras || ""}
                          onChange={(e) => handleInputChange(e, "monto_total_compras")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.monto_total_compras
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.estado || ""}
                          onChange={(e) => handleInputChange(e, "estado")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.estado
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.calificacion || ""}
                          onChange={(e) => handleInputChange(e, "calificacion")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.calificacion
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.historico_devoluciones || ""}
                          onChange={(e) => handleInputChange(e, "historico_devoluciones")}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        proveedor.historico_devoluciones
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.creado_en || ""}
                          onChange={(e) => handleInputChange(e, "creado_en")}
                          size="small"
                          fullWidth
                          disabled
                        />
                      ) : (
                        proveedor.creado_en ? format(new Date(proveedor.creado_en), 'dd/MM/yyyy HH:mm:ss') : ""
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <TextField
                          value={editedData.actualizado_en || ""}
                          onChange={(e) => handleInputChange(e, "actualizado_en")}
                          size="small"
                          fullWidth
                          disabled
                        />
                      ) : (
                        proveedor.actualizado_en ? format(new Date(proveedor.actualizado_en), 'dd/MM/yyyy HH:mm:ss') : ""
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === proveedor.id_proveedores ? (
                        <IconButton onClick={() => onSave(proveedor.id_proveedores)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => onEdit(proveedor)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => onDelete(proveedor.id_proveedores)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(proveedoresFiltrados.length / proveedoresPorPagina)}
        page={pagina}
        onChange={(event, value) => setPagina(value)}
        sx={{ marginTop: "20px" }}
      />


    </div>
  );
};

export default Proveedores;

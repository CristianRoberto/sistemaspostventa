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
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import 'bootstrap-icons/font/bootstrap-icons.css';

// Definir la estructura de los datos de las compras
interface Compra {
  id_compras_productos: number;
  numero_factura: any;
  producto_id: number;
  cantidad: number;
  precio_compra: string;
  total_compra: string;
  fecha_compra: string;
  producto: {
    producto_id: number;
    nombre: string;
    descripcion: string;
    precio: string;
  };
  proveedor: {
    id_proveedores: number;
    nombre: string;
    tipo_proveedor: string;
    ruc_cif: string;
    telefono: string;
    correo_electronico: string;
    direccion_fisica: string;
    persona_contacto: string;
    telefono_contacto: string;
    plazo_pago: string;
    metodo_pago: string;
    moneda: string;
    descuento_volumen: string | null;
    condiciones_entrega: string;
    fecha_ultimo_pedido: string | null;
    monto_total_compras: string | null;
    estado: string;
    calificacion: string | null;
    historico_devoluciones: string | null;
    creado_en: string;
    actualizado_en: string;
  };
}

const ListaCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [criterio, setCriterio] = useState("producto");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(false);
  const comprasPorPagina = 10;

  useEffect(() => {
    axios.get("http://localhost:5000/compraproducto/")
      .then((response) => {
        setCompras(response.data.map((compra: { numero_factura: any; }) => ({
          ...compra,
          numero_factura: compra.numero_factura,  // Asegúrate de incluir el numero de factura
        })));
      })
      .catch((error) => {
        console.error("Error al obtener compras:", error);
        setMensaje("Hubo un error al obtener las compras.");
      });

  }, []);

  const comprasFiltradas = compras.filter((compra) => {
    if (criterio === "producto") {
      return compra.producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    } else if (criterio === "proveedor") {
      return compra.proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase());
    } else if (criterio === "fecha") {
      return compra.fecha_compra.includes(busqueda);
    }
    return true;
  });

  const onEdit = (compra: Compra) => {
    setEditingRow(compra.id_compras_productos); // Inicia la edición de esta fila
    setEditedData({ ...compra }); // Carga los datos para editar
  };



  const onSave = (id_compras_productos: number) => {
    if (!editedData) return;
    setLoading(true);
    axios
      .put(`http://localhost:5000/compraproducto/${id_compras_productos}`, editedData)
      .then(() => {
        setCompras(
          compras.map((compra) =>
            compra.id_compras_productos === id_compras_productos
              ? {
                ...editedData,
                numero_factura: compra.numero_factura, // Mantener el numero de factura
              }
              : compra
          )
        );
        setMensaje(`Compra con factura ${editedData.numero_factura} actualizada con éxito.`); // Mostramos el numero de factura
      })
      .catch((error) => {
        console.error("Error al actualizar compra:", error);
        setMensaje("Hubo un error al actualizar la compra.");
      })
      .finally(() => setLoading(false));
    setEditingRow(null);
  };


  const onDelete = (id_compras_productos: number) => {
    setLoading(true);
    const compraEliminada = compras.find(
      (compra) => compra.id_compras_productos === id_compras_productos
    );

    axios
      .delete(`http://localhost:5000/compraproducto/${id_compras_productos}`)
      .then(() => {
        setCompras((prevCompras) =>
          prevCompras.filter((compra) => compra.id_compras_productos !== id_compras_productos)
        );
        setMensaje(`Compra con factura ${compraEliminada?.numero_factura} eliminada con éxito.`);
      })
      .catch((error) => {
        console.error("Error al eliminar la compra:", error);
        setMensaje(`Hubo un error al eliminar la compra.`);
      })
      .finally(() => setLoading(false));
  };


  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
        Buscar Compras
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
            <MenuItem value="producto">Nombre_Producto</MenuItem>
            <MenuItem value="proveedor">Nombre_Proveedor</MenuItem>
            <MenuItem value="fecha">fecha_compra</MenuItem>
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
              <TableCell>ID</TableCell>
              <TableCell>#Factura_Compra</TableCell> {/* Nueva columna */}
              <TableCell>Producto</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio_Compra</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha_Compra</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comprasFiltradas
              .slice((pagina - 1) * comprasPorPagina, pagina * comprasPorPagina)
              .map((compra) => (
                <TableRow key={compra.id_compras_productos}>
                  <TableCell>{compra.id_compras_productos}</TableCell>
                  <TableCell>{compra.numero_factura}</TableCell>

                  <TableCell>
                    {editingRow === compra.id_compras_productos ? (
                      <TextField
                        value={editedData?.producto.nombre || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            producto: { ...editedData!.producto, nombre: e.target.value },
                          })
                        }
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      compra.producto.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === compra.id_compras_productos ? (
                      <TextField
                        value={editedData?.proveedor.nombre || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            proveedor: { ...editedData!.proveedor, nombre: e.target.value },
                          })
                        }
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      compra.proveedor.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === compra.id_compras_productos ? (
                      <TextField
                        value={editedData?.cantidad || 0}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            cantidad: parseInt(e.target.value, 10),
                          })
                        }
                        variant="outlined"
                        fullWidth
                        type="number"
                      />
                    ) : (
                      compra.cantidad
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === compra.id_compras_productos ? (
                      <TextField
                        value={editedData?.precio_compra || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            precio_compra: e.target.value,
                          })
                        }
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      `$${parseFloat(compra.precio_compra).toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === compra.id_compras_productos ? (
                      <TextField
                        value={editedData?.total_compra || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData!,
                            total_compra: e.target.value,
                          })
                        }
                        variant="outlined"
                        fullWidth
                      />
                    ) : (
                      `$${parseFloat(compra.total_compra).toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>{new Date(compra.fecha_compra).toLocaleString()}</TableCell>

                  <TableCell>
                    {editingRow === compra.id_compras_productos ? (
                      <IconButton onClick={() => onSave(compra.id_compras_productos)}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => onEdit(compra)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => onDelete(compra.id_compras_productos)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(comprasFiltradas.length / comprasPorPagina)}
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

export default ListaCompras;

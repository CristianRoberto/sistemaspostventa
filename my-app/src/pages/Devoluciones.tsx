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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { InputAdornment } from '@mui/material';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Devoluciones: React.FC = () => {
    const [devoluciones, setDevoluciones] = useState<any[]>([]);
    const [criterio, setCriterio] = useState("venta_id");
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);
    const [mensaje, setMensaje] = useState<string>("");
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editedData, setEditedData] = useState<any>({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedDevolucion, setSelectedDevolucion] = useState<any>(null);

    const devolucionesPorPagina = 10;

    useEffect(() => {
        axios
            .get("http://localhost:5000/devoluciones")
            .then((response) => setDevoluciones(response.data))
            .catch((error) => {
                console.error("Error al obtener devoluciones:", error);
                setMensaje("Hubo un error al obtener las devoluciones.");
            });
    }, []);

    const devolucionesFiltradas = devoluciones.filter((devolucion) => {
        const valor = devolucion[criterio as keyof typeof devolucion];
        return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
    });

    const onEdit = (devolucion: any) => {
        setEditingRow(devolucion.devolucion_id);
        setEditedData(devolucion);
    };

    const onSave = (devolucionId: number) => {
        if (!editedData.monto_devolucion || !editedData.motivo_devolucion || !editedData.cantidad) {
            setMensaje("Por favor, complete todos los campos.");
            return;
        }
        axios
            .put(`http://localhost:5000/devoluciones/${devolucionId}`, editedData)
            .then(() => {
                setDevoluciones(
                    devoluciones.map((dev) => (dev.devolucion_id === devolucionId ? editedData : dev))
                );
                setMensaje("Devolución actualizada con éxito.");
            })
            .catch((error) => {
                console.error("Error al actualizar devolución:", error);
                setMensaje("Hubo un error al actualizar la devolución.");
            });
        setEditingRow(null);
    };

    const onDelete = (devolucionId: number) => {
        axios
            .delete(`http://localhost:5000/devoluciones/${devolucionId}`)
            .then(() => {
                setDevoluciones(devoluciones.filter((devolucion) => devolucion.devolucion_id !== devolucionId));
                setMensaje("Devolución eliminada con éxito.");
            })
            .catch((error) => {
                console.error("Error al eliminar la devolución:", error);
                setMensaje("Hubo un error al eliminar la devolución.");
            });
    };

    const openDetailsModal = (devolucion: any) => {
        setSelectedDevolucion(devolucion);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedDevolucion(null);
    };

    // Función para formatear la fecha
    const formatFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
                Buscar Devoluciones
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
                        <MenuItem value="venta_id">Venta ID</MenuItem>
                        <MenuItem value="producto_id">Producto ID</MenuItem>
                        <MenuItem value="fecha_devolucion">Fecha de Devolución</MenuItem>
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
                            <TableCell sx={{ fontWeight: 600 }}>Venta ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Producto</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Cantidad</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Motivo de Devolución</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Monto de Devolución</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {devolucionesFiltradas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ textAlign: "center", padding: "20px" }}>
                                    <Typography variant="h6" color="error">
                                        No hay devoluciones que coincidan con la búsqueda.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            devolucionesFiltradas
                                .slice((pagina - 1) * devolucionesPorPagina, pagina * devolucionesPorPagina)
                                .map((devolucion) => (
                                    <TableRow key={devolucion.devolucion_id}>
                                        <TableCell>{devolucion.devolucion_id}</TableCell>
                                        <TableCell>{devolucion.venta_id}</TableCell>
                                        <TableCell>{devolucion.producto.nombre}</TableCell>
                                        <TableCell>
                                            {editingRow === devolucion.devolucion_id ? (
                                                <TextField
                                                    value={editedData.cantidad}
                                                    onChange={(e) => setEditedData({ ...editedData, cantidad: e.target.value })}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                devolucion.cantidad
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRow === devolucion.devolucion_id ? (
                                                <TextField
                                                    value={editedData.motivo_devolucion}
                                                    onChange={(e) => setEditedData({ ...editedData, motivo_devolucion: e.target.value })}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                devolucion.motivo_devolucion
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRow === devolucion.devolucion_id ? (
                                                <TextField
                                                    value={editedData.monto_devolucion}
                                                    onChange={(e) => setEditedData({ ...editedData, monto_devolucion: e.target.value })}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                            ) : (
                                                devolucion.monto_devolucion
                                            )}
                                        </TableCell>
                                        <TableCell>{formatFecha(devolucion.fecha_devolucion)}</TableCell>
                                        <TableCell>
                                            {editingRow === devolucion.devolucion_id ? (
                                                <IconButton
                                                    onClick={() => onSave(devolucion.devolucion_id)}
                                                    sx={{
                                                        padding: '0', // Eliminar padding para que el área de hover sea más pequeña
                                                        '&:hover': {
                                                            backgroundColor: 'transparent', // No mostrar fondo en el hover
                                                        },
                                                        display: 'inline-flex', // Asegurarse de que el contenedor se ajuste al icono
                                                        width: 'auto', // Ajustar el ancho para que no se expanda
                                                        height: 'auto', // Ajustar el alto
                                                    }}
                                                >
                                                    <SaveIcon sx={{ fontSize: 30 }} /> {/* Ajustar el tamaño del icono */}
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={() => onEdit(devolucion)}
                                                    sx={{
                                                        padding: '0',
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                        },
                                                        display: 'inline-flex',
                                                        width: 'auto',
                                                        height: 'auto',
                                                    }}
                                                >
                                                    <EditIcon sx={{ fontSize: 30 }} />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                onClick={() => onDelete(devolucion.devolucion_id)}
                                                sx={{
                                                    padding: '0',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                    display: 'inline-flex',
                                                    width: 'auto',
                                                    height: 'auto',
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: 30 }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => openDetailsModal(devolucion)}
                                                sx={{
                                                    padding: '0',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                    display: 'inline-flex',
                                                    width: 'auto',
                                                    height: 'auto',
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
                count={Math.ceil(devolucionesFiltradas.length / devolucionesPorPagina)}
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

            <Dialog
                open={openModal}
                onClose={closeModal}
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                    },
                    '& .MuiDialogTitle-root': {
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '16px',
                    },
                    '& .MuiDialogContent-root': {
                        fontSize: '1rem',
                        color: '#555',
                    },
                    '& .MuiDialogActions-root': {
                        borderTop: '1px solid #ddd',
                        padding: '10px 16px',
                    },
                }}
            >
                <DialogTitle style={{ fontWeight: 600 }}>Detalles de la Devolución</DialogTitle>
                <DialogContent>
                    {selectedDevolucion && (
                        <div>
                            <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                ID de Devolución: {selectedDevolucion.devolucion_id}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                Venta ID: {selectedDevolucion.venta_id}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                Producto: {selectedDevolucion.producto.nombre}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Descripción del Producto: {selectedDevolucion.producto.descripcion}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Precio del Producto: {selectedDevolucion.producto.precio}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Categoría del Producto: {selectedDevolucion.producto.categoria.nombre}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Motivo de Devolución: {selectedDevolucion.motivo_devolucion}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Cantidad Devuelta: {selectedDevolucion.cantidad}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Monto de Devolución: {selectedDevolucion.monto_devolucion}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Fecha de Devolución: {formatFecha(selectedDevolucion.fecha_devolucion)}
                            </Typography>
                            <Typography variant="h6" sx={{ marginTop: 2, fontWeight: '600' }}>
                                Detalles de la Venta
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Total Neto de la Venta: {selectedDevolucion.venta.total_neto}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Total de la Venta: {selectedDevolucion.venta.total}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Método de Pago: {selectedDevolucion.venta.metodo_pago}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Estado de la Venta: {selectedDevolucion.venta.estado}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: '500' }}>
                                Fecha de la Venta: {formatFecha(selectedDevolucion.venta.fecha)}
                            </Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary" variant="contained" sx={{ fontWeight: '500' }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default Devoluciones;

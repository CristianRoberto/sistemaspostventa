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
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField, InputAdornment } from "@mui/material";
import "bootstrap-icons/font/bootstrap-icons.css";

const Facturacion: React.FC = () => {
    const [facturas, setFacturas] = useState<any[]>([]);
    const [criterio, setCriterio] = useState("numero_factura");
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);
    const [mensaje, setMensaje] = useState<string>("");
    const facturasPorPagina = 10;

    useEffect(() => {
        axios
            .get("http://localhost:5000/facturas")
            .then((response) => {
                console.log("Facturas recibidas:", response.data); 
                setFacturas(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener facturas:", error);
                setMensaje("Hubo un error al obtener las facturas.");
            });
    }, []);

    const facturasFiltradas = facturas.filter((factura) => {
        const valor = factura[criterio as keyof typeof factura];
        return valor?.toString().toLowerCase().includes(busqueda.toLowerCase());
    });

    // Función para formatear fechas
    const formatearFecha = (fecha: string) => {
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(fecha));
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 500 }}>
                Buscar Facturas
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
                        <MenuItem value="numero_factura">Número de Factura</MenuItem>
                        <MenuItem value="cliente_nombre">Nombre del Cliente</MenuItem>
                        <MenuItem value="estado_pago">Estado de Pago</MenuItem>
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
                            <TableCell sx={{ fontWeight: 600 }}>Número de Factura</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha de Emisión</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha de Vencimiento</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Estado de Pago</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {facturasFiltradas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", padding: "20px" }}>
                                    <Typography variant="h6" color="error">
                                        No hay facturas que coincidan con la búsqueda.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            facturasFiltradas
                                .slice((pagina - 1) * facturasPorPagina, pagina * facturasPorPagina)
                                .map((factura) => (
                                    <TableRow key={factura.factura_id}>
                                        <TableCell>{factura.numero_factura}</TableCell>
                                        <TableCell>{formatearFecha(factura.fecha_emision)}</TableCell> {/* Formateo de fecha */}
                                        <TableCell>{formatearFecha(factura.fecha_vencimiento)}</TableCell> {/* Formateo de fecha */}
                                        <TableCell>{factura.venta.cliente?.nombre}</TableCell>
                                        <TableCell>${factura.total}</TableCell>
                                        <TableCell>{factura.estado_pago}</TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton>
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
                count={Math.ceil(facturasFiltradas.length / facturasPorPagina)}
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

export default Facturacion;

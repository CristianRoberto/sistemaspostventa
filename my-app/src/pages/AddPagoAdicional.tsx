import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, Snackbar, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddPagoAdicional: React.FC = () => {
    const [pago, setPago] = useState({
        id_pago: 0,
        monto: "",
        concepto: "",
        tipo_pago: "",
        id_proveedor: "",
        empleado_id: "",
        cliente_id: ""
    });

    const [pagos, setPagos] = useState<any[]>([]);
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [mensaje, setMensaje] = useState("");
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const navigate = useNavigate();

    // Función para obtener los datos
    const fetchData = async () => {
        try {
            const [empleadosData, pagosData, proveedoresData, clientesData] = await Promise.all([
                axios.get("http://localhost:5000/empleado"),
                axios.get("http://localhost:5000/obtenerpagos"),
                axios.get("http://localhost:5000/proveedor"),
                axios.get("http://localhost:5000/clientes/")
            ]);
            setEmpleados(empleadosData.data);
            setPagos(pagosData.data);
            setProveedores(proveedoresData.data);
            setClientes(clientesData.data);
        } catch (error: any) {
            console.error("Error al obtener datos:", error);
            const mensajeError = error.response?.data?.message || "Error al cargar los datos.";
            setMensaje(mensajeError);
        }
    };

    useEffect(() => {
        fetchData(); // Cargar datos al iniciar
    }, []);

    const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setPago((prevPago) => ({ ...prevPago, [name as string]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = pago.id_pago === 0 ? "post" : "put";
        const url = pago.id_pago === 0
            ? "http://localhost:5000/Ingresarpagos"
            : `http://localhost:5000/actualizarpago/${pago.id_pago}`;

        try {
            const response = await axios[method](url, {
                monto: pago.monto,
                concepto: pago.concepto,
                tipo_pago: pago.tipo_pago,
                id_proveedor: pago.id_proveedor,
                empleado_id: pago.empleado_id,
                cliente_id: pago.cliente_id
            });

            setMensaje(`Pago de ${pago.monto} ${pago.id_pago === 0 ? "registrado" : "actualizado"} correctamente.`);
            fetchData();
            setPago({
                id_pago: 0,
                monto: "",
                concepto: "",
                tipo_pago: "",
                id_proveedor: "",
                empleado_id: "",
                cliente_id: ""
            });
        } catch (error: any) {
            console.error("Error completo del backend:", error);

            let mensajeError = "Error al registrar o actualizar el pago."; // Mensaje genérico

            // Si el backend responde con un mensaje, úsalo
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
                mensajeError = error.response.data?.message || JSON.stringify(error.response.data);
            } else if (error.request) {
                console.error("No hubo respuesta del servidor:", error.request);
                mensajeError = "No se recibió respuesta del servidor.";
            } else {
                console.error("Error al hacer la solicitud:", error.message);
                mensajeError = error.message;
            }

            setMensaje(mensajeError);
        }
    };



    const handleEdit = (pagoSeleccionado: any) => {
        setPago(pagoSeleccionado);
        setEditingRow(pagoSeleccionado.id_pago);
    };

    const handleDelete = async (pagoId: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este pago?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/eliminarpago/${pagoId}`);
                setMensaje("Pago eliminado correctamente.");
                fetchData();
            } catch (error: any) {
                console.error("Error al eliminar el pago:", error);
                const mensajeError = error.response?.data?.message || "Error al eliminar el pago.";
                setMensaje(mensajeError);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    {pago.id_pago === 0 ? "Agregar Pago Adicional" : "Editar Pago Adicional"}
                </Typography>

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

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Monto" name="monto" type="number" value={pago.monto} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Concepto de Pago" name="concepto" value={pago.concepto} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Tipo de Pago" name="tipo_pago" select value={pago.tipo_pago} onChange={handleChange} required>
                                <MenuItem value="Efectivo">Efectivo</MenuItem>
                                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                                <MenuItem value="Transferencia">Transferencia</MenuItem>
                                <MenuItem value="Cheque">Cheque</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Proveedor" name="id_proveedor" select value={pago.id_proveedor || ""} onChange={handleChange}>
                                {proveedores.map((proveedor) => (
                                    <MenuItem key={proveedor.id_proveedores} value={proveedor.id_proveedores}>{proveedor.nombre}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Empleado" name="empleado_id" select value={pago.empleado_id || ""} onChange={handleChange}>
                                {empleados.map((empleado) => (
                                    <MenuItem key={empleado.empleado_id} value={empleado.empleado_id}>{empleado.nombre}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Cliente" name="cliente_id" select value={pago.cliente_id || ""} onChange={handleChange}>
                                {clientes.map((cliente) => (
                                    <MenuItem key={cliente.cliente_id} value={cliente.cliente_id}>{cliente.nombre} {cliente.apellidos}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Button type="submit"
                        className="botonguardar"
                        variant="contained" color={pago.id_pago === 0 ? "primary" : "secondary"} fullWidth style={{ marginTop: "20px", fontWeight: 600 }}>
                        {pago.id_pago === 0 ? "Guardar Nuevo Pago" : "Actualizar Pago Seleccionado"}
                    </Button>
                </form>
            </Paper>

            <br></br>

            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>Tabla de Pagos Adicionales</Typography>
                <Table>
                    <TableHead>
                        <TableRow className="headertabla">
                            <TableCell sx={{ fontWeight: 600 }}># Pago</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Monto</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Concepto</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Tipo de Pago</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Proveedor</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>

                            <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagos.map((pago) => (
                            <TableRow key={pago.id_pago}>
                                <TableCell>{pago.id_pago}</TableCell>
                                <TableCell>{pago.monto}</TableCell>
                                <TableCell>{pago.concepto}</TableCell>
                                <TableCell>{pago.tipo_pago}</TableCell>
                                <TableCell>{pago.proveedor?.nombre}</TableCell>
                                <TableCell>{pago.empleado?.nombre}</TableCell>
                                <TableCell>{pago.cliente?.nombre}</TableCell>

                                <TableCell>
                                    <IconButton onClick={() => handleEdit(pago)} sx={{
                                        padding: '0', // Eliminar padding para que el área de hover sea más pequeña
                                        '&:hover': {
                                            backgroundColor: 'transparent', // No mostrar fondo en el hover
                                        },
                                        display: 'inline-flex', // Asegurarse de que el contenedor se ajuste al icono
                                        width: 'auto', // Ajustar el ancho para que no se expanda
                                        height: 'auto', // Ajustar el alto
                                    }}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(pago.id_pago)} sx={{
                                        padding: '0', // Eliminar padding para que el área de hover sea más pequeña
                                        '&:hover': {
                                            backgroundColor: 'transparent', // No mostrar fondo en el hover
                                        },
                                        display: 'inline-flex', // Asegurarse de que el contenedor se ajuste al icono
                                        width: 'auto', // Ajustar el ancho para que no se expanda
                                        height: 'auto', // Ajustar el alto
                                    }}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AddPagoAdicional;

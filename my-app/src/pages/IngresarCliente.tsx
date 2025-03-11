import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, SelectChangeEvent, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';


const IngresarCliente: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const [cliente, setCliente] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion: "",
        estado: "",
        tipo_cliente: "",
        ruc_cedula: "",
        metodo_contacto_preferido: "",
        ultima_compra: "",
        total_compras: "",
        observaciones: "",
        nivel_satisfaccion: "",
        cantidad_reclamos: "",
    });
    const [tipoMensaje, setTipoMensaje] = useState("success"); // 'success' o 'error'
    const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito o error
    const [openModal, setOpenModal] = useState(false); // Estado para abrir el modal
    const [clienteRegistrado, setClienteRegistrado] = useState<any>(null); // Estado para guardar el cliente registrado

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/clientes", cliente);
            setMensaje(`Cliente ${cliente.nombre} registrado correctamente.`);
            setTipoMensaje("success"); // Mensaje en verde
            setClienteRegistrado(response.data);
            setOpenModal(true);
        } catch (error: any) {
            console.error("Error del backend:", error.response?.data);
            const mensajeError = error.response?.data?.error || error.response?.data?.message || "Error al registrar el cliente.";
            setMensaje(mensajeError);
            setTipoMensaje("error"); // Mensaje en rojo
        }
    };



    // Verifica si la ubicación actual es /clientes/nuevo
    const mostrarCarrito = location.pathname === '/clientes/nuevo';

    return (
        <Container maxWidth="lg">
            {mostrarCarrito && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/carrito")}
                    style={{
                        position: 'fixed',
                        top: '10px',
                        right: '20px',
                        zIndex: 1000,
                        borderRadius: '50%',
                        width: "90px",
                        height: "90px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "none",
                    }}
                >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>Carrito</span>
                    <ShoppingCartIcon style={{ fontSize: "32px" }} />
                </Button>
            )}


            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>



                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    Registrar Nuevo Cliente
                </Typography>
                <br></br>

                {/* Mostrar mensajes de éxito o error */}
                <Snackbar
                    open={mensaje !== ""}
                    autoHideDuration={6000}
                    onClose={() => setMensaje("")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setMensaje("")} severity={tipoMensaje === "error" ? "error" : "success"}>
                        {mensaje}
                    </Alert>
                </Snackbar>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Nombre */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombres"
                                name="nombre"
                                value={cliente.nombre}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        padding: 0,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "12px 14px",
                                        height: "auto",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Apellidos */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Apellidos"
                                name="apellidos"
                                value={cliente.apellidos}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        padding: 0,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "12px 14px",
                                        height: "auto",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={cliente.email}
                                onChange={handleChange}
                                required
                                type="email"
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        padding: 0,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "12px 14px",
                                        height: "auto",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Teléfono */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                name="telefono"
                                value={cliente.telefono}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        padding: 0,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "12px 14px",
                                        height: "auto",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Dirección */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                name="direccion"
                                value={cliente.direccion}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        padding: 0,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "12px 14px",
                                        height: "auto",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Estado */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="estado"
                                    value={cliente.estado}
                                    onChange={handleChange}
                                    label="Estado"
                                >
                                    <MenuItem value="activo">Activo</MenuItem>
                                    <MenuItem value="inactivo">Inactivo</MenuItem>
                                    <MenuItem value="pendiente">Pendiente</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Tipo de cliente */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Tipo de Cliente</InputLabel>
                                <Select
                                    name="tipo_cliente"
                                    value={cliente.tipo_cliente}
                                    onChange={handleChange}
                                    label="Tipo de Cliente"
                                >
                                    <MenuItem value="nuevo">Nuevo</MenuItem>
                                    <MenuItem value="frecuente">Frecuente</MenuItem>
                                    <MenuItem value="vip">VIP</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* RUC/Cédula */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="RUC/Cédula"
                                name="ruc_cedula"
                                value={cliente.ruc_cedula}
                                onChange={handleChange}
                                required
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        padding: 0,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiOutlinedInput-input": {
                                        padding: "12px 14px",
                                        height: "auto",
                                        boxSizing: "border-box",
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Botón para enviar el formulario */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="botonguardar"
                        style={{ marginTop: "20px", fontWeight: 600 }}
                    >
                        Guardar Nuevo Cliente
                    </Button>
                </form>
            </Paper>


        </Container>
    );
};

export default IngresarCliente;

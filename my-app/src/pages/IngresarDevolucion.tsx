import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, Snackbar, Alert, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IngresarDevolucion: React.FC = () => {
    const navigate = useNavigate();

    const [productos, setProductos] = useState<any[]>([]); // Lista de productos
    const [clientes, setClientes] = useState<any[]>([]); // Lista de clientes
    const [devolucion, setDevolucion] = useState({
        producto_id: "",
        cantidad: "",
        motivo: "",
        cliente_id: "",
    });
    const [tipoMensaje, setTipoMensaje] = useState("success"); // 'success' o 'error'
    const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito o error

    // Cargar productos y clientes desde el backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const productosResponse = await axios.get("http://localhost:5000/productos");
                const clientesResponse = await axios.get("http://localhost:5000/clientes");
                setProductos(productosResponse.data);
                setClientes(clientesResponse.data);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;
        setDevolucion({
            ...devolucion,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/devoluciones", devolucion);
            setMensaje(`Devolución registrada correctamente.`);
            setTipoMensaje("success");
            navigate("/devoluciones");
        } catch (error: any) {
            console.error("Error del backend:", error.response?.data);
            const mensajeError = error.response?.data?.error || error.response?.data?.message || "Error al registrar la devolución.";
            setMensaje(mensajeError);
            setTipoMensaje("error");
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    Registrar Devolución
                </Typography>

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
                <br></br>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Producto */}
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                value={productos.find((producto) => producto.producto_id === devolucion.producto_id) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setDevolucion({
                                            ...devolucion,
                                            producto_id: newValue.producto_id, // Usamos producto_id
                                        });
                                    }
                                }}
                                options={productos}
                                getOptionLabel={(option) => option.nombre}
                                renderInput={(params) => <TextField {...params} label="Producto" required />}
                                isOptionEqualToValue={(option, value) => option.producto_id === value.producto_id}
                                freeSolo
                            />
                        </Grid>

                          {/* Cliente */}
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                value={clientes.find((cliente) => cliente.cliente_id === devolucion.cliente_id) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        setDevolucion({
                                            ...devolucion,
                                            cliente_id: newValue.cliente_id, // Usamos cliente_id
                                        });
                                    }
                                }}
                                options={clientes}
                                getOptionLabel={(option) => `${option.nombre} ${option.apellidos}`}
                                renderInput={(params) => <TextField {...params} label="Cliente" required />}
                                isOptionEqualToValue={(option, value) => option.cliente_id === value.cliente_id}
                                freeSolo
                            />
                        </Grid>

                        {/* Cantidad */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cantidad"
                                name="cantidad"
                                value={devolucion.cantidad}
                                onChange={handleChange}
                                required
                                type="number"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "1px solid #ccc", // Agrega borde
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

                        {/* Motivo */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Motivo"
                                name="motivo"
                                value={devolucion.motivo}
                                onChange={handleChange}
                                required
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "1px solid #ccc", // Agrega borde
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
                        className="botonguardar"

                        fullWidth
                        style={{ marginTop: "20px", fontWeight: 600 }}
                    >
                        Guardar Devolución
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default IngresarDevolucion;

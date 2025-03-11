import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Grid,
    Button,
    Snackbar,
    Alert,
    Autocomplete,
} from "@mui/material";
import axios from "axios";

const IngresarCompras = () => {
    const [compra, setCompra] = useState({
        numero_factura: "",
        producto_id: null, // Cambio a null
        cantidad: "",
        precio_compra: "",
        id_proveedor: null, // Cambio a null
    });
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await axios.get("http://localhost:5000/proveedor/");
                console.log("Proveedores recibidos:", response.data);  // Agrega esto
                setProveedores(response.data);
            } catch (err) {
                console.error("Error al cargar los proveedores:", err);
                setError("Hubo un error al cargar los proveedores.");
            }
        };

        fetchProveedores();
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/productos/");
                console.log("Productos recibidos:", response.data);  // Agrega esto
                setProductos(response.data);
            } catch (err) {
                console.error("Error al cargar los productos:", err);
                setError("Hubo un error al cargar los productos.");
            }
        };

        fetchProductos();
    }, []);


    const handleChange = (e) => {
        setCompra({
            ...compra,
            [e.target.name]: e.target.value,
        });
        console.log("Campo cambiado:", e.target.name, "Valor:", e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos de la compra a enviar:", compra);

        // Validación antes de enviar
        if (!compra.producto_id || !compra.id_proveedor || !compra.cantidad || !compra.precio_compra) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/compraproducto/", compra);
            console.log("Respuesta del servidor:", response);
            setMensaje("Compra registrada correctamente.");
            setCompra({
                numero_factura: "",
                producto_id: null as any, // Cambio a any
                cantidad: "",
                precio_compra: "",
                id_proveedor: null as any // Cambio a null
            });
        } catch (err) {
            console.error("Error al registrar la compra:", err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response?.data?.error || "Error desconocido al registrar la compra.");
            } else {
                setError("Hubo un error al registrar la compra.");
            }
        }
    };

    return (
        <Container>
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    Registrar Nueva Compra
                </Typography>

                {error && (
                    <Typography color="error" gutterBottom>
                        {error}
                    </Typography>
                )}

                <br />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Número de Factura */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Número de Factura"
                                name="numero_factura"
                                value={compra.numero_factura}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Producto */}
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                value={productos.find((producto) => producto.producto_id === compra.producto_id) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        console.log("Producto seleccionado:", newValue);
                                        setCompra({
                                            ...compra,
                                            producto_id: newValue.producto_id, // Usamos producto_id
                                        });
                                    }
                                }}
                                options={productos}
                                getOptionLabel={(option) => option.nombre}
                                renderInput={(params) => <TextField {...params} label="Producto" required />}
                                isOptionEqualToValue={(option, value) => option.producto_id === value.producto_id} // Compara por producto_id
                                freeSolo
                            />
                        </Grid>

                        {/* Cantidad */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cantidad"
                                name="cantidad"
                                value={compra.cantidad}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Precio de Compra */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Precio de Compra"
                                name="precio_compra"
                                value={compra.precio_compra}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Proveedor */}
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                fullWidth
                                value={proveedores.find((proveedor) => proveedor.id_proveedores === compra.id_proveedor) || null}
                                onChange={(event, newValue) => {
                                    if (newValue) {
                                        console.log("Proveedor seleccionado:", newValue);
                                        setCompra({
                                            ...compra,
                                            id_proveedor: newValue.id_proveedores, // Usamos id_proveedores
                                        });
                                    }
                                }}
                                options={proveedores}
                                getOptionLabel={(option) => option.nombre}
                                renderInput={(params) => <TextField {...params} label="Proveedor" required />}
                                isOptionEqualToValue={(option, value) => option.id_proveedores === value.id_proveedores} // Compara por id_proveedores
                                freeSolo
                            />
                        </Grid>
                    </Grid>

                    {/* Botón Guardar */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="botonguardar"
                        style={{ marginTop: "20px", fontWeight: 600 }}
                    >
                        Guardar Nueva Compra
                    </Button>
                </form>
            </Paper>

            {/* Mostrar mensajes de éxito o error */}
            <Snackbar
                open={mensaje !== "" && !mensaje.includes("error")}
                autoHideDuration={6000}
                onClose={() => setMensaje("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setMensaje("")} severity="success">
                    {mensaje}
                </Alert>
            </Snackbar>

            {/* Mostrar error en caso de fallo */}
            <Snackbar
                open={error !== ""}
                autoHideDuration={6000}
                onClose={() => setError("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setError("")} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default IngresarCompras;

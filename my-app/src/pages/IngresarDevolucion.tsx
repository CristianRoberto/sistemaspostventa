import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IngresarDevolucion: React.FC = () => {
    const navigate = useNavigate();

    const [clientes, setClientes] = useState<any[]>([]);
    const [devolucion, setDevolucion] = useState({
        venta_id: "",
        cliente_id: "",
        producto_id: "",
        producto_nombre: "",
        cantidad: "",
        monto_devolucion: "",
        precio_unitario: "",
        subtotal: "",
        total_venta: "",
        motivo_devolucion: "",
    });
    const [tipoMensaje, setTipoMensaje] = useState("success");
    const [mensaje, setMensaje] = useState("");
    const [errores, setErrores] = useState<any>({});

    // Cargar clientes al inicio
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/clientes");
                setClientes(response.data);
            } catch (error) {
                console.error("Error al cargar los clientes:", error);
            }
        };
        fetchClientes();
    }, []);

    // Buscar los datos de la venta al ingresar el número de venta
    useEffect(() => {
        if (devolucion.venta_id) {
            const fetchVenta = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/ventas/${devolucion.venta_id}`);
                    const venta = response.data;

                    console.log("Datos de la venta obtenidos:", venta); // Para depuración

                    // Extraer el primer detalle de la venta (suponiendo que solo se devuelve un producto por vez)
                    const detalle = venta.detalles.length > 0 ? venta.detalles[0] : null;

                    // Actualiza los campos con los datos de la venta
                    setDevolucion((prev) => ({
                        ...prev,
                        cliente_id: venta.cliente_id,
                        producto_id: detalle ? detalle.producto_id : "",
                        producto_nombre: detalle ? detalle.producto.nombre : "",
                        cantidad: detalle ? detalle.cantidad : "",
                        precio_unitario: detalle ? detalle.precio : "",
                        subtotal: detalle ? detalle.subtotal : "",
                        total_venta: venta.total, // Monto total de la venta
                    }));

                    // Limpiar errores si la venta es encontrada
                    setErrores({});
                } catch (error) {
                    console.error("Error al obtener la venta:", error);
                    setErrores((prev: any) => ({
                        ...prev,
                        venta_id: "Número de venta no encontrado."
                    }));
                }
            };

            fetchVenta();
        } else {
            // Limpiar errores si no hay venta_id
            setErrores({});
        }
    }, [devolucion.venta_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;
        setDevolucion((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Enviando formulario de devolución:", devolucion); // Para depuración

        try {
            const response = await axios.post("http://localhost:5000/devoluciones", devolucion);

            console.log("Respuesta del backend:", response.data); // Para depuración

            setMensaje(`Devolución registrada correctamente.`);
            setTipoMensaje("success");
            // navigate("/devoluciones");
        } catch (error: any) {
            console.error("Error en la solicitud:", error);
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

                <br />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Número de Venta */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Número de Venta"
                                name="venta_id"
                                value={devolucion.venta_id || ""}
                                onChange={handleChange}
                                required
                                type="text"
                                error={!!errores.venta_id}
                                helperText={errores.venta_id}
                            />
                        </Grid>

                        {/* Cliente */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cliente"
                                value={
                                    devolucion.cliente_id
                                        ? clientes.find((cliente) => cliente.cliente_id === devolucion.cliente_id)?.nombre + " " +
                                        clientes.find((cliente) => cliente.cliente_id === devolucion.cliente_id)?.apellidos || ""
                                        : ""
                                }
                                disabled={false} // Siempre habilitado
                            />
                        </Grid>


                        {/* Producto */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Producto"
                                value={devolucion.producto_nombre}
                                disabled={false} // Siempre habilitado
                            />
                        </Grid>

                        {/* Cantidad Vendida */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cantidad Vendida"
                                value={devolucion.cantidad}
                                disabled={false} // Siempre habilitado
                            />
                        </Grid>

                        {/* Cantidad a Devolver */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cantidad a Devolver"
                                name="monto_devolucion"
                                value={devolucion.monto_devolucion}
                                onChange={handleChange}
                                required
                                type="number"
                            />
                        </Grid>

                        {/* Precio Unitario */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Precio Unitario"
                                value={devolucion.precio_unitario}
                                disabled={false} // Siempre habilitado
                            />
                        </Grid>

                        {/* Subtotal */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Subtotal"
                                value={devolucion.subtotal}
                                disabled={false} // Siempre habilitado
                            />
                        </Grid>

                        {/* Total de la Venta */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Total de la Venta"
                                value={devolucion.total_venta}
                                disabled={false} // Siempre habilitado
                            />
                        </Grid>

                        {/* Motivo de Devolución */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Motivo de Devolución"
                                name="motivo_devolucion"
                                value={devolucion.motivo_devolucion}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>

                    {/* Botón para enviar el formulario */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
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

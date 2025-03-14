import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, Snackbar, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddCategoriaProducto: React.FC = () => {
    const [categoria, setCategoria] = useState({
        categoria_id: 0,
        nombre: "",
        descripcion: "",
    });

    const [categorias, setCategorias] = useState<any[]>([]);
    const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito o error

    const navigate = useNavigate();

    useEffect(() => {
        // Obtener las categorías desde el backend
        axios.get("http://localhost:5000/categorias")
            .then(response => {
                setCategorias(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las categorías:", error);
                setMensaje("Error al cargar las categorías.");
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;
        setCategoria({
            ...categoria,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (categoria.categoria_id === 0) {
                // Crear nueva categoría
                const response = await axios.post("http://localhost:5000/categorias", {
                    nombre: categoria.nombre,
                    descripcion: categoria.descripcion
                });
                setMensaje(`Categoría ${categoria.nombre} registrada correctamente.`);
            } else {
                // Actualizar categoría existente
                const response = await axios.put(`http://localhost:5000/categorias/${categoria.categoria_id}`, {
                    nombre: categoria.nombre,
                    descripcion: categoria.descripcion
                });
                setMensaje(`Categoría ${categoria.nombre} actualizada correctamente.`);
            }

            // Refrescar la lista de categorías después de la operación
            const response = await axios.get("http://localhost:5000/categorias");
            setCategorias(response.data);

            setCategoria({
                categoria_id: 0,
                nombre: "",
                descripcion: "",
            }); // Limpiar los campos
        } catch (error) {
            console.error("Error al registrar o actualizar la categoría:", error);
            setMensaje("Error al registrar o actualizar la categoría.");
        }
    };

    const handleEdit = (categoriaSeleccionada: any) => {
        // Llenar el formulario con los datos de la categoría a editar
        setCategoria(categoriaSeleccionada);
    };

    const handleDelete = async (categoriaId: number) => {
        try {
            // Confirmar la eliminación antes de proceder
            const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría?");
            if (confirmDelete) {
                await axios.delete(`http://localhost:5000/categorias/${categoriaId}`);

                // Refrescar la lista de categorías después de eliminar
                const response = await axios.get("http://localhost:5000/categorias");
                setCategorias(response.data);

                setMensaje("Categoría eliminada correctamente.");
            }
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            setMensaje("Error al eliminar la categoría.");
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    {categoria.categoria_id === 0 ? "Agregar Categoria de Producto" : "Editar Categoria de Producto"}
                </Typography>

                {/* Mostrar mensajes de éxito o error */}
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
                        {/* Nombre */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre Categoria"
                                name="nombre"
                                value={categoria.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Descripción */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Descripción Categoria"
                                name="descripcion"
                                value={categoria.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>

                    {/* Botón para enviar el formulario */}
                    <Button
                        type="submit"
                        variant="contained"
                        className="botonguardar"
                        color={categoria.categoria_id === 0 ? "primary" : "secondary"} // Cambiar a 'secondary' si es actualización
                        fullWidth
                        style={{ marginTop: "20px", fontWeight: 600 }}
                    >
                        {categoria.categoria_id === 0 ? "Guardar Nueva Categoria" : "Actualizar Categoria Seleccionada"}
                    </Button>
                </form>
            </Paper>

            <br></br>
            {/* Tabla de Categorías */}
            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    Tabla de Categorías Productos
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow className="headertabla">
                            <TableCell sx={{ fontWeight: 600 }}>Categoria ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {categorias.map((categoria) => (
                            <TableRow key={categoria.categoria_id}>
                                <TableCell>{categoria.categoria_id}</TableCell>
                                <TableCell>{categoria.nombre}</TableCell>
                                <TableCell>{categoria.descripcion}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(categoria)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(categoria.categoria_id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AddCategoriaProducto;

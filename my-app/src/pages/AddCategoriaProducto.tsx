import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, SelectChangeEvent, Dialog, DialogActions, DialogContent, DialogTitle, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const AddCategoriaProducto: React.FC = () => {
    const [producto, setProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria_id: 0, // Valor inicial en 0 (para "Seleccionar categoría")
        imagenproducto: null as File | null, // Para la imagen del producto
    });

    const [categorias, setCategorias] = useState<any[]>([]);
    const [mensaje, setMensaje] = useState(""); // Para mostrar mensajes de éxito o error
    const [imagenPreview, setImagenPreview] = useState<string | null>(null); // Para la vista previa de la imagen

    // Estado para abrir el modal
    const [openModal, setOpenModal] = useState(false);
    const [editingRow, setEditingRow] = useState<number | null>(null); // Controlar la fila seleccionada para edición


    // Estado para guardar el producto registrado
    const [productoRegistrado, setProductoRegistrado] = useState<any>(null);

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
        const { name, value, files } = e.target;

        if (name === "imagenproducto" && files) {
            const file = files[0];
            setProducto({
                ...producto,
                imagenproducto: file,
            });

            // Crear una vista previa de la imagen
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setProducto({
                ...producto,
                [name]: value,
            });
        }
    };

    const handleCategoriaChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setProducto((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // En tu componente IngresarProducto
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Crear FormData para enviar datos incluyendo la imagen
            const formData = new FormData();
            formData.append('nombre', producto.nombre);
            formData.append('descripcion', producto.descripcion);
            formData.append('precio', producto.precio);
            formData.append('categoria_id', String(producto.categoria_id));

            // Si se ha seleccionado una imagen, agregarla a FormData
            if (producto.imagenproducto) {
                formData.append('imagenproducto', producto.imagenproducto);
            }

            // Enviar los datos del producto al backend
            const response = await axios.post("http://localhost:5000/productos", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Mostrar mensaje de éxito
            setMensaje(`Producto ${producto.nombre} registrado correctamente.`);
            setProductoRegistrado(response.data.producto); // Guardar el producto registrado
            setOpenModal(true); // Abrir el modal con los detalles del producto registrado
        } catch (error) {
            console.error("Error al registrar el producto:", error);
            setMensaje("Error al registrar el producto.");
        }
    };




    const handleCloseModal = () => {
        setOpenModal(false); // Cerrar el modal
    };

    function onSave(categoria_id: any): void {
        throw new Error("Function not implemented.");
    }

    function onEdit(categoria_id: any): void {
        throw new Error("Function not implemented.");
    }

    function onDelete(categoria_id: any): void {
        setEditingRow(categoria_id.cliente_id); // Inicia la edición de esta fila

        throw new Error("Function not implemented.");
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                    Agregar Categoria de Producto
                </Typography>
                <br></br>

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
                                label="Nombre_Categoria"
                                name="nombre"
                                value={producto.nombre}
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

                        {/* Descripción */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Descripción_Categoria"
                                name="descripcion"
                                value={producto.descripcion}
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

                    {/* Vista previa de la imagen seleccionada */}
                    {/* Botón para enviar el formulario */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="botonguardar"
                        style={{ marginTop: "20px", fontWeight: 600 }}
                    >
                        Guardar Categoria para los productos
                    </Button>
                </form>



            </Paper>

            {/* Modal de confirmación */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle style={{ textAlign: "center" }}>Producto Registrado</DialogTitle>
                <DialogContent style={{ textAlign: "center" }}>
                    <Typography variant="body1">Nombre: {productoRegistrado?.nombre}</Typography>
                    <Typography variant="body1">Descripción: {productoRegistrado?.descripcion}</Typography>

                    {productoRegistrado?.imagenproducto && (
                        <div style={{ marginTop: "10px" }}>
                            <img
                                src={`http://localhost:5000/uploads/${productoRegistrado.imagenproducto}`}
                                alt="Imagen del producto"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    )}

                    {/* Aquí agregamos los dos botones alineados */}
                    <Box display="flex" justifyContent="space-between" marginTop="20px">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // Mostrar los datos que se están enviando con el estado
                                console.log("Producto a enviar:", productoRegistrado);

                                // Redirigir a la página de agregar inventario, pasando el producto registrado
                                navigate("/inventario/agregar", {
                                    state: { productoRegistrado }, // Aquí pasas el objeto con los datos del producto
                                });
                            }}
                        >
                            Agregar inventario del Producto
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCloseModal}
                        >
                            No, en otro momento
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>


            {/* Tabla de Categorías */}
            <br></br>

            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
                Tabla de Categorias Productos
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
                        {categorias
                            // .slice((pagina - 1) * categoriasPorPagina, pagina * categoriasPorPagina)
                            .map((categoria) => (
                                <TableRow key={categoria.categoria_id}>
                                    <TableCell>{categoria.categoria_id}</TableCell>
                                    <TableCell>{categoria.nombre}</TableCell>
                                    <TableCell>{categoria.descripcion}</TableCell>
                                    {/* Aquí irían las acciones */}
                                    {/* Acciones */}
                                    <TableCell>
                                        {editingRow === categoria.cliente_id ? (
                                            <IconButton onClick={() => onSave(categoria.categoria_id)}>
                                                <SaveIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => onEdit(categoria)}>
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                        <IconButton onClick={() => onDelete(categoria.categoria_id)}>
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

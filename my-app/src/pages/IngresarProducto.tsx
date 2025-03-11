import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, SelectChangeEvent, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const IngresarProducto: React.FC = () => {
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

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 500 }}>
          Registrar Nuevo Producto
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
                label="Nombre"
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
                label="Descripción"
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

            {/* Categoría */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  labelId="categoria-label"
                  id="categoria_id"
                  name="categoria_id"
                  value={producto.categoria_id}
                  onChange={handleCategoriaChange}
                  label="Categoría"
                >
                  {/* Opción predeterminada */}
                  <MenuItem value={0} disabled>
                    Seleccionar categoría
                  </MenuItem>

                  {/* Opciones de las categorías */}
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.categoria_id} value={categoria.categoria_id}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Precio */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                name="precio"
                value={producto.precio}
                onChange={handleChange}
                required
                type="number" // Se asegura de que sea un campo numérico
              />
            </Grid>

            {/* Input para la imagen */}
            <Grid item xs={12} sm={6}>
              <input
                type="file"
                name="imagenproducto"
                onChange={handleChange}
                accept="image/*"
              />
            </Grid>
          </Grid>

          {/* Vista previa de la imagen seleccionada */}
          {imagenPreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imagenPreview}
                alt="Vista previa"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          {/* Botón para enviar el formulario */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="botonguardar"
            style={{ marginTop: "20px", fontWeight: 600 }}
          >
            Guardar Nuevo Producto
          </Button>
        </form>
      </Paper>

      {/* Modal de confirmación */}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle style={{ textAlign: "center" }}>Producto Registrado</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <Typography variant="body1">Nombre: {productoRegistrado?.nombre}</Typography>
          <Typography variant="body1">Descripción: {productoRegistrado?.descripcion}</Typography>
          <Typography variant="body1">Precio: {productoRegistrado?.precio}</Typography>
          <Typography variant="body1">
            Categoría: {
              categorias.find(categoria => categoria.categoria_id === productoRegistrado?.categoria_id)?.nombre
            }
          </Typography>

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
        {/* <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cerrar
          </Button>
        </DialogActions> */}
      </Dialog>



    </Container>
  );
};

export default IngresarProducto;

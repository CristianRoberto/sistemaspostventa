import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, InputAdornment, MenuItem, TextField, Snackbar, Alert, Pagination, CardMedia, IconButton, Box } from '@mui/material';
import axios from 'axios';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { ShoppingCartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Producto: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [mensaje, setMensaje] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const [productosSeleccionados, setProductosSeleccionados] = useState<{ [key: number]: boolean }>({});

  const productosPorPagina = 9;
  const navigate = useNavigate();


  useEffect(() => {
    // Recuperar el mensaje guardado
    const mensajeGuardado = localStorage.getItem("mensajeCompra");
    if (mensajeGuardado) {
      setMensaje(mensajeGuardado);
      // Borrar el mensaje para que no se quede persistente en la próxima carga de la página
      localStorage.removeItem("mensajeCompra");
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/productos")
      .then((response) => {
        setProductos(response.data);
        const inicializarCantidades = response.data.reduce((acc: any, producto: any) => {
          acc[producto.producto_id] = 1;
          return acc;
        }, {});
        setCantidades(inicializarCantidades);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setMensaje("Hubo un error al obtener los productos.");

      });
  }, []);

  const handleCantidadChange = (productoId: number, nuevaCantidad: number) => {
    setCantidades((prev) => ({
      ...prev,
      [productoId]: nuevaCantidad >= 1 ? nuevaCantidad : 1,
    }));
  };



  const addToCart = (producto: any) => {
    try {
      let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const productoExistente = carrito.find((item: any) => item.producto_id === producto.producto_id);
  
      if (productosSeleccionados[producto.producto_id]) {
        // Si el producto ya está seleccionado, lo deseleccionamos y lo eliminamos del carrito
        carrito = carrito.filter((item: any) => item.producto_id !== producto.producto_id);
        setProductosSeleccionados((prev) => ({
          ...prev,
          [producto.producto_id]: false,
        }));
        setMensaje(`${producto.nombre} deseleccionado y eliminado del carrito.`);
      } else {
        // Si el producto no está seleccionado, lo agregamos al carrito
        if (productoExistente) {
          productoExistente.cantidad += cantidades[producto.producto_id];
        } else {
          carrito.push({ ...producto, cantidad: cantidades[producto.producto_id] });
        }
        setProductosSeleccionados((prev) => ({
          ...prev,
          [producto.producto_id]: true,
        }));
        setMensaje(`${producto.nombre} agregado al carrito correctamente!`);
      }
  
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));
  
    } catch (error) {
      console.error("Error al agregar o eliminar producto al carrito:", error);
      setMensaje("Error al modificar el carrito.");
    }
  
    setOpenSnackbar(true);
  };
  

  const onEdit = (producto: any) => {
    setEditingRow(producto.producto_id);
    setEditedData({ ...producto });
  };

  const onSave = (producto_id: number) => {
    if (!editedData.nombre || !editedData.precio || !editedData.descripcion) {
      setMensaje("Los campos nombre, precio y descripción son obligatorios.");
      return;
    }
  
    axios
      .put(`http://localhost:5000/productos/${producto_id}`, editedData)
      .then(() => {
        setProductos(
          productos.map((prod) =>
            prod.producto_id === producto_id ? { ...prod, ...editedData } : prod
          )
        );
        setMensaje("Producto actualizado con éxito.");
      })
      .catch((error) => {
        console.error("Error al actualizar producto:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setMensaje(`Error: ${error.response.data.error}`);
        } else {
          setMensaje("Hubo un error al actualizar el producto.");
        }
      });
    setEditingRow(null);
  };
  
  const onDelete = (producto_id: number) => {
    axios
      .delete(`http://localhost:5000/productos/${producto_id}`)
      .then(() => {
        setProductos(productos.filter((producto) => producto.producto_id !== producto_id));
        setMensaje("Producto eliminado con éxito.");
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setMensaje(`Error: ${error.response.data.error}`);
        } else {
          setMensaje("Hubo un error al eliminar el producto.");
        }
      });
  };
  

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const productosFiltrados = productos.filter((producto) =>
    producto[criterio] && producto[criterio].toLowerCase().includes(busqueda.toLowerCase())
  );


  const startIndex = (page - 1) * productosPorPagina;
  const endIndex = startIndex + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Buscar Productos</Typography>

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
            }}
            variant="outlined"
          >
            <MenuItem value="nombre">Nombre Producto</MenuItem>
            <MenuItem value="descripcion">Descripción</MenuItem>
            <MenuItem value="precio">Precio</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Buscar"
            variant="outlined"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
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

      <br />

      <Grid container spacing={3}>
        {productosFiltrados.length === 0 ? (
          <Grid item xs={12} sx={{ textAlign: "center", padding: "20px" }}>
            <Typography variant="h6" color="error">
              No hay productos que coincidan con la búsqueda.
            </Typography>
          </Grid>
        ) : (
          productosPaginados.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.producto_id}>
              <Card style={{ background: "linear-gradient(45deg, rgba(199, 168, 204, 0.14), rgba(226, 223, 226, 0.2))" }}>
                <CardMedia
                  component="img"
                  alt={producto.nombre}
                  height="140"
                  image={`http://localhost:5000/uploads/${producto.imagenproducto}`}
                  title={producto.nombre}
                />
                <Grid container spacing={0} justifyContent="right" style={{ marginTop: '0px' }}>
                  <Grid item>
                    {editingRow === producto.producto_id ? (
                      <IconButton onClick={() => onSave(producto.producto_id)} color="primary">
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => onEdit(producto)} color="primary" sx={{ marginRight: "10px" }}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => onDelete(producto.producto_id)} sx={{ marginRight: "20px" }} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <CardContent style={{ marginTop: "-30px" }}>
                  <Typography variant="h6">
                    {editingRow === producto.producto_id ? (
                      <TextField
                        label="Nombre"
                        value={editedData.nombre}
                        onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      producto.nombre
                    )}
                  </Typography>

                  <Typography color="textSecondary" align="center">
                    {editingRow === producto.producto_id ? (
                      <TextField
                        label="Precio"
                        value={editedData.precio}
                        onChange={(e) => setEditedData({ ...editedData, precio: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                    ) : (
                      `Precio: $${producto.precio}`
                    )}
                  </Typography>

                  {editingRow === producto.producto_id ? (
                    <TextField
                      label="Descripción"
                      value={editedData.descripcion}
                      onChange={(e) => setEditedData({ ...editedData, descripcion: e.target.value })}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {producto.descripcion}
                    </Typography>
                  )}

                  <TextField
                    type="number"
                    label="Cantidad"
                    value={cantidades[producto.producto_id] || 1}
                    onChange={(e) => handleCantidadChange(producto.producto_id, Number(e.target.value))}
                    inputProps={{ min: 1 }}
                    fullWidth
                    margin="normal"
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addToCart(producto)}
                    style={{ marginTop: '16px',
                      backgroundColor: productosSeleccionados[producto.producto_id] ? '#4CAF50' : '#1976D2', 

                    }}
                    
                  >
                    {productosSeleccionados[producto.producto_id] ? "Producto Seleccionado" : "Agregar al carrito"}
                    </Button>
                </CardContent>

              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(productosFiltrados.length / productosPorPagina)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>

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

      <Snackbar
      open={mensaje !== ""}
      autoHideDuration={5000} // Ajustamos el tiempo de duración a 5 segundos
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

export default Producto;

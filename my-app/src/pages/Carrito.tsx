import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, List, ListItem, ListItemText, IconButton, TextField, Divider, Card, CardContent, Autocomplete, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, FormHelperText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack, styled } from '@mui/system';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';


// Estilos usando styled
const Container = styled(Card)({
  maxWidth: '600px',
  margin: '40px auto',
  padding: '20px',
  textAlign: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  borderRadius: '12px',
});

const Title = styled(Typography)({
  fontWeight: 600,
  color: '#333',
  marginBottom: '20px',
});

const ProductItem = styled(ListItem)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '10px',
  marginBottom: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

const ProductPrice = styled(Typography)({
  fontWeight: 600,
  fontSize: '16px',
  color: '#2e7d32',
});

const Total = styled(Typography)({
  fontWeight: 600,
  fontSize: '18px',
  marginTop: '20px',
  color: '#333',
});

const ButtonStyled = styled(Button)({
  marginTop: '20px',
  width: '100%',
  borderRadius: '50px',
  padding: '12px',
  fontWeight: 600,
});

const Carrito: React.FC = () => {
  const navigate = useNavigate();  // Usar useNavigate para la navegación
  const getCarrito = () => JSON.parse(localStorage.getItem("carrito") || "[]"); // Obtener carrito de localStorage
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any | null>(null); // Estado para el cliente seleccionado
  const [clientes, setClientes] = useState<any[]>([]);  // Estado para la lista de clientes
  const [carrito, setCarrito] = useState<any[]>(getCarrito()); // Estado para el carrito
  const [total, setTotal] = useState<number>(0); // Estado para el total de la compra
  const [mensaje, setMensaje] = useState<string>(""); // Estado para el mensaje del Snackbar
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");  // Estado para el método de pago
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga


  useEffect(() => {
    buscarClientes();
  }, []);

  // Actualizar el total cuando cambie el carrito
  useEffect(() => {
    setTotal(carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0));
  }, [carrito]);

  // Función para eliminar producto del carrito
  const eliminarProducto = (productoId: number) => {
    const nuevoCarrito = carrito.filter((producto) => producto.producto_id !== productoId);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (productoId: number, cantidad: number) => {
    const nuevoCarrito = carrito.map((producto) =>
      producto.producto_id === productoId ? { ...producto, cantidad } : producto
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  // Buscar clientes desde la API
  const buscarClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes/');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handlePaymentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPaymentMethod(event.target.value as string);
  };

  const handlePurchase = () => {
    if (carrito.length === 0 || !selectedPaymentMethod) {
      setMensaje("Por favor, Seleciona el Metodo de Pago");
      return;
    }
    setOpenModal(true);
  };

  // Función para navegar de vuelta a la página de productos
  const goBackToProducts = () => {
    navigate("/productos");
  };

  const confirmPurchase = async (enviarFactura: boolean) => {
    setOpenModal(false);
    setLoading(true); // Activar loading




    const orden = {
      cliente_id: clienteSeleccionado?.cliente_id,
      empleado_id: 39,
      productos: carrito.map((producto) => ({ producto_id: producto.producto_id, cantidad: producto.cantidad })),
      metodo_pago: selectedPaymentMethod,
      estado: "pagada",  // Cambié el estado a "pagada" ya que la venta es exitosa
      enviar_factura: enviarFactura,
    };

    try {
      const response = await axios.post("http://localhost:5000/ventas/", orden, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200) throw new Error("Error al procesar la compra");

      const numeroFactura = response.data.numero_factura;


      setCarrito([]);
      localStorage.removeItem("carrito");
      localStorage.setItem("mensajeCompra", `¡Compra realizada con éxito! Número de factura: ${numeroFactura}`);
      navigate("/productos");

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {

        const errorMessage = error.response?.data?.error || "Hubo un problema al procesar la compra. Inténtalo de nuevo.";
        setMensaje(errorMessage);
      } else {
        // En caso de que el error no sea de tipo AxiosError, mostramos un mensaje genérico
        setMensaje("Hubo un problema al procesar la compra. Inténtalo de nuevo.");
      }

    } finally {
      setLoading(false); // Desactivar loading
    }
  };

  return (
    <Container>
      {/* Mensaje de estado */}
      <Snackbar
        open={mensaje !== ""}
        autoHideDuration={6000}
        onClose={() => setMensaje("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMensaje("")}
          severity={mensaje.toLowerCase().includes("error") ? "error" : "success"}
          sx={{
            backgroundColor: mensaje.toLowerCase().includes("error") ? "" : "red",
            color: "white" // Establecer el color de las letras a blanco
          }}
        >
          {mensaje}
        </Alert>
      </Snackbar>


      {/* Selección de Cliente */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Autocomplete
          options={clientes}
          getOptionLabel={(option) => `${option.cliente_id} - ${option.nombre} ${option.apellidos} - ${option.ruc_cedula} - ${option.email}`}
          filterOptions={(options, { inputValue }) =>
            options.filter((cliente) =>
              (`${cliente.cliente_id} ${cliente.nombre} ${cliente.apellidos} ${cliente.ruc_cedula} ${cliente.email}`)
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            )
          }
          onChange={(_event, value) => setClienteSeleccionado(value)}
          renderInput={(params) => (
            <TextField {...params} label="Seleccionar Cliente" variant="outlined" sx={{ width: "450px" }} />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "20%" }}
          onClick={() => {
            localStorage.setItem("vieneDeAgregarCliente", "true");
            navigate('/clientes/nuevo');
          }}
        >
          Nuevo Cliente
        </Button>
      </Stack>

      <CardContent>
        <Title variant="h4">Carrito de Compras</Title>

        {carrito.length > 0 ? (
          <>
            <List>
              {carrito.map((producto) => (
                <ProductItem key={producto.producto_id}>
                  <ListItemText primary={producto.nombre} />
                  <ProductPrice variant="body2">${producto.precio * producto.cantidad}</ProductPrice>
                  <ListItemText secondary={`Cantidad: ${producto.cantidad}`} />
                  <TextField
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => actualizarCantidad(producto.producto_id, parseInt(e.target.value))}
                    size="small"
                    inputProps={{ min: 1 }}
                    style={{ width: "70px", marginRight: "10px" }}
                  />
                  <IconButton
                    style={{ width: '40px', padding: '10px', marginLeft: "10px" }}
                    onClick={() => eliminarProducto(producto.producto_id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ProductItem>
              ))}
            </List>
            <Divider sx={{ margin: '20px 0' }} />
            <Total variant="h6">Total: ${total}</Total>

            {/* Select para el método de pago */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="payment-method-label">Método de Pago</InputLabel>
              <Select
                labelId="payment-method-label"
                value={selectedPaymentMethod}
                onChange={handlePaymentChange}
                label="Método de Pago"
              >
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="credit-card">Tarjeta de Crédito</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="bank-transfer">Transferencia Bancaria</MenuItem>
              </Select>
              {!selectedPaymentMethod && <FormHelperText error>Por favor, selecciona un método de pago.</FormHelperText>}
            </FormControl>

            <ButtonStyled variant="contained" color="primary" onClick={handlePurchase} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Proceder con la Venta"}
            </ButtonStyled>
          </>
        ) : (
          <Typography color="error">Tu carrito está vacío</Typography>
        )}

        <ButtonStyled variant="outlined" color="secondary" onClick={goBackToProducts}>
          Volver a productos
        </ButtonStyled>


        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle style={{ width: '100%' }}>
            ¿Desea enviar la factura?
            <IconButton
              aria-label="close"
              onClick={() => setOpenModal(false)}
              sx={{ width: '40px', left: '150px', top: 4 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Puedes elegir si deseas enviar la factura al cliente o no.
              {clienteSeleccionado && (
                <>
                  <br />
                  Correo Electrónico: {clienteSeleccionado.email}
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => confirmPurchase(false)} color="secondary" autoFocus>
              No Enviar
            </Button>
            <Button variant="contained" onClick={() => confirmPurchase(true)} color="primary" autoFocus>
              Enviar
            </Button>
          </DialogActions>
        </Dialog>

      </CardContent>
    </Container>
  );
};

export default Carrito;

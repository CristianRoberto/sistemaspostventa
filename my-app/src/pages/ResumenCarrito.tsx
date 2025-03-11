// ResumenCarrito.tsx
import React from 'react';
import { Grid, Typography, Button, Paper } from "@mui/material";

interface ResumenCarritoProps {
  carrito: any[];
  eliminarDelCarrito: (productoId: number) => void;
  totalCompra: number;
}

const ResumenCarrito: React.FC<ResumenCarritoProps> = ({ carrito, eliminarDelCarrito, totalCompra }) => {
  return (
    <Paper sx={{ marginTop: "30px", padding: "20px" }}>
      <Typography variant="h6">Resumen del Carrito</Typography>
      {carrito.length > 0 ? (
        carrito.map((item) => (
          <Grid container key={item.producto_id} alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <Typography>{item.nombre} - Cantidad: {item.cantidad} - Total: ${item.total}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "right" }}>
              <Button variant="outlined" color="secondary" onClick={() => eliminarDelCarrito(item.producto_id)}>
                Eliminar
              </Button>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography>No hay productos en el carrito.</Typography>
      )}
      <Typography variant="h6" sx={{ marginTop: "20px" }}>
        Total Compra: ${totalCompra}
      </Typography>
    </Paper>
  );
};

export default ResumenCarrito;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button, TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material'; // Importar los componentes de MUI
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icono de retroceso
import "../css/DetalleVenta.css";

// Definir las interfaces para los datos
interface Cliente {
  cliente_id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  estado: string;
  tipo_cliente: string;
  ruc_cedula: string;
  metodo_contacto_preferido: string;
  ultima_compra: string;
  total_compras: string;
  observaciones: string;
  nivel_satisfaccion: number;
  cantidad_reclamos: number;
}

interface Empleado {
  empleado_id: number;
  cedula: string | null;
  nombre: string;
  direccion: string | null;
  puesto: string;
  telefono: string;
  email: string;
  salario: string | null;
  imagenempleado: string | null;
}

interface DetalleVenta {
  producto_id: number;
  nombre: string;
  descripcion: string;
  imagenproducto: string;
  precio: string;
  cantidad: number;
  subtotal: number;
  descuento: number;
  impuestos: number;
}

interface Venta {
  venta_id: number;
  total_neto: number;
  total: string;
  descuento: string;
  impuestos: string;
  metodo_pago: string;
  estado: string;
  fecha: string;
  cliente: Cliente;
  empleado: Empleado;
  detalles: DetalleVenta[];
}

const DetallesVenta = () => {
  const { id } = useParams(); // Obtienes el id de la venta
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para navegar entre rutas

  useEffect(() => {
    const fetchVentaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ventas/${id}`);
        setVenta(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentaDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Cargando detalles de la venta...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!venta) return <p className="text-center text-gray-600">No se encontraron detalles de la venta.</p>;

  return (
    <div

    >
      <Card sx={{ color: 'black' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Detalles de la Venta {venta.venta_id}
          </Typography>

          {/* Información de la venta */}
          <Typography variant="h6" gutterBottom>
            Información de la Venta
          </Typography>

          <Grid container spacing={60} justifyContent="center">
            <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Total Neto:</strong></Typography>
                <Typography>${venta.total_neto > 0 ? venta.total_neto : '0.00'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Total:</strong></Typography>
                <Typography>${venta.total > 0 ? venta.total : '0.00'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Descuento:</strong></Typography>
                <Typography>${venta.descuento > 0 ? venta.descuento : '0.00'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Impuestos:</strong></Typography>
                <Typography>${venta.impuestos > 0 ? venta.impuestos : '0.00'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Método de Pago:</strong></Typography>
                <Typography>{venta.metodo_pago}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Estado:</strong></Typography>
                <Typography>{venta.estado}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Fecha:</strong></Typography>
                <Typography>{new Date(venta.fecha).toLocaleString()}</Typography>
              </div>
            </Grid>
          </Grid>





          {/* Información del cliente */}
          <Typography variant="h6" gutterBottom className="mt-4">
            Cliente
          </Typography>

          <Grid container spacing={60} justifyContent="center">
            <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Nombre:</strong></Typography>
                <Typography>{venta.cliente?.nombre || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Email:</strong></Typography>
                <Typography>{venta.cliente?.email || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Teléfono:</strong></Typography>
                <Typography>{venta.cliente?.telefono || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Dirección:</strong></Typography>
                <Typography>{venta.cliente?.direccion || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Estado:</strong></Typography>
                <Typography>{venta.cliente?.estado || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Tipo Cliente:</strong></Typography>
                <Typography>{venta.cliente?.tipo_cliente || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>RUC/Cédula:</strong></Typography>
                <Typography>{venta.cliente?.ruc_cedula || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Método de Contacto Preferido:</strong></Typography>
                <Typography>{venta.cliente?.metodo_contacto_preferido || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Nivel de Satisfacción:</strong></Typography>
                <Typography>{venta.cliente?.nivel_satisfaccion || 'No disponible'}</Typography>
              </div>
            </Grid>
          </Grid>







          {/* Información del empleado */}
          <Typography variant="h6" gutterBottom className="mt-4">
            Empleado
          </Typography>

          <Grid container spacing={60} justifyContent="center">
            <Grid item xs={12} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Nombre:</strong></Typography>
                <Typography>{venta.empleado?.nombre || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Puesto:</strong></Typography>
                <Typography>{venta.empleado?.puesto || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Email:</strong></Typography>
                <Typography>{venta.empleado?.email || 'No disponible'}</Typography>
              </div>
              <div style={{ marginBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Typography><strong>Teléfono:</strong></Typography>
                <Typography>{venta.empleado?.telefono || 'No disponible'}</Typography>
              </div>
            </Grid>
          </Grid>

          {/* Detalles de los productos vendidos */}
          <Typography variant="h6" gutterBottom className="mt-4">
            Productos Vendidos
          </Typography>
          <TableContainer component={Paper} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Producto</strong></TableCell>
                  <TableCell><strong>Descripción</strong></TableCell>
                  <TableCell><strong>Cantidad</strong></TableCell>
                  <TableCell><strong>Precio Unitario</strong></TableCell>
                  <TableCell><strong>Subtotal</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {venta.detalles?.length ? (
                  venta.detalles.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>{detalle.producto?.nombre || 'Producto no disponible'}</TableCell>
                      <TableCell>{detalle.producto?.descripcion || 'Descripción no disponible'}</TableCell>
                      <TableCell>{detalle.cantidad || '0'}</TableCell>
                      <TableCell>${detalle.precio || '0.00'}</TableCell>
                      <TableCell>${detalle.subtotal || '0.00'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No hay productos vendidos</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>


        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/detalleventa/historial")}
        style={{
          position: 'fixed',
          top: '10px', // Puedes ajustar este valor si lo deseas más cerca o lejos del borde superior
          left: '10px', // Moverlo al lado izquierdo
          zIndex: 1000,
          borderRadius: '50%',
          width: "60px",
          height: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "none",
        }}
      >
        <ArrowBackIcon style={{ fontSize: "32px", color: 'white' }} />
      </Button>

    </div>
  );
};

export default DetallesVenta;

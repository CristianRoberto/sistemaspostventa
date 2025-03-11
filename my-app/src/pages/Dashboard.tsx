import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';


interface VentasData {
    total: number;
    mensuales: { mes: string; ventas: number }[];
    diarias: number;
  }

// interface VentasData {
//     total: number;
//     mensuales: { mes: string; ventas: number }[];
// }

interface InventariosData {
    disponibles: number;
    productos: { producto: string; cantidad: number }[];
}

interface ClientesData {
    activos: number;
}

interface EmpleadosData {
    activos: number;
}

const Dashboard = () => {
    const [ventas, setVentas] = useState<VentasData | null>(null);
    const [inventarios, setInventarios] = useState<InventariosData | null>(null);
    const [clientes, setClientes] = useState<ClientesData | null>(null);
    const [empleados, setEmpleados] = useState<EmpleadosData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setVentas({
                total: 15300,
                mensuales: [
                    { mes: 'Enero', ventas: 3200 },
                    { mes: 'Febrero', ventas: 2800 },
                    { mes: 'Marzo', ventas: 3300 },
                    { mes: 'Abril', ventas: 2700 },
                    { mes: 'Mayo', ventas: 3800 },
                ],
                diarias: 1200, // Ventas del día (simulado)
              });

            setInventarios({
                disponibles: 1500,
                productos: [
                    { producto: 'Laptop', cantidad: 150 },
                    { producto: 'Smartphone', cantidad: 200 },
                    { producto: 'Monitor', cantidad: 100 },
                    { producto: 'Teclado', cantidad: 400 },
                    { producto: 'Auriculares', cantidad: 150 },
                ]
            });

            setClientes({ activos: 320 });
            setEmpleados({ activos: 25 });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={3}>
                {[
                  { title: 'Ventas Totales', value: `$${ventas?.total.toLocaleString()} USD`, color: '#4CAF50' },
                  { title: 'Ventas del Mes', value: `$${ventas?.mensuales[ventas?.mensuales.length - 1]?.ventas.toLocaleString()} USD`, color: '#FF9800' },
                  { title: 'Ventas del Día', value: `$${ventas?.diarias.toLocaleString()} USD`, color: '#2196F3' },
                  { title: 'Clientes Activos', value: clientes?.activos ?? 0, color: '#9C27B0' },
                  { title: 'Inventario Disponible', value: `${inventarios?.disponibles ?? 0} productos`, color: '#009688' },
                  { title: 'Empleados Activos', value: empleados?.activos ?? 0, color: '#795548' }
                  
                ].map((kpi, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ backgroundColor: kpi.color, color: 'white' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{kpi.title}</Typography>
                                <Typography variant="h5">{kpi.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Gráfico de Ventas por Mes */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Ventas por Mes
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ventas?.mensuales}>
                                    <XAxis dataKey="mes" stroke="#333" />
                                    <YAxis stroke="#333" />
                                    <Tooltip />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Bar dataKey="ventas" fill="#4CAF50" barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de Inventario por Producto */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Inventario por Producto
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={inventarios?.productos}>
                                    <XAxis dataKey="producto" stroke="#333" />
                                    <YAxis stroke="#333" />
                                    <Tooltip />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Bar dataKey="cantidad" fill="#2196F3" barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;

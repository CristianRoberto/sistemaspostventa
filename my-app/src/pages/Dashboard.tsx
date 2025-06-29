import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import CapitalDisponibleCard from '../components/CapitalDisponibleCard';
import { width } from '@mui/system';

interface VentasData {
    total: number;
    mensuales: {
        actual: any; mes: string; ventas: number
    }[];
    diarias: number;
}

interface InventariosData {
    disponibles: number;
    productos: { producto: string; cantidad: number }[];
}

interface ClientesData {
    clientesactivos: number;
}

interface EmpleadosData {
    total: number;
}

const Dashboard: React.FC = () => {
    const [ventas, setVentas] = useState<VentasData | null>(null);
    const [inventarios, setInventarios] = useState<InventariosData | null>(null);
    const [clientes, setClientes] = useState<ClientesData | null>(null);
    const [empleados, setEmpleados] = useState<EmpleadosData | null>(null);
    const [loading, setLoading] = useState(true);




    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await fetch('http://localhost:5000/ventastotales');
                const data = await response.json();

                // obtener las ventas mensuales
                const resMensuales = await fetch('http://localhost:5000/resumenmensual');
                const dataMensuales = await resMensuales.json();

                // preparar los 12 meses completos
                const mesesTexto = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];

                const ventasMensuales: { mes: string; ventas: number; actual: boolean }[] = mesesTexto.map((mes, index) => {
                    const mesNumero = index + 1;
                    const encontrado = dataMensuales.find((m: any) => parseInt(m.mes) === mesNumero);
                    return {
                        mes,
                        ventas: encontrado ? parseFloat(encontrado.total) : 0,
                        actual: (new Date().getMonth() + 1) === mesNumero
                    };
                });

                setVentas({
                    total: data.total,
                    mensuales: ventasMensuales,
                    diarias: data.dia
                });

            } catch (error) {
                console.error('Error al traer resumen de ventas', error);
            }
        };

        fetchVentas();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    resVentas,
                    resEmpleados,
                    resInventarios,
                    resClientes
                ] = await Promise.all([
                    fetch('http://localhost:5000/ventastotales'),
                    fetch('http://localhost:5000/totalempleados'),
                    fetch('http://localhost:5000/resumeninventario'),
                    fetch('http://localhost:5000/totalcliente')
                ]);

                const dataVentas = await resVentas.json();
                const dataEmpleados = await resEmpleados.json();
                const dataInventarios = await resInventarios.json();
                const dataClientes = await resClientes.json();

                // Ventas
                setVentas({
                    total: dataVentas.total,
                    mensuales: [{
                        mes: 'Actual', ventas: dataVentas.mes,
                        actual: undefined
                    }],
                    diarias: dataVentas.dia
                });

                // Empleados
                setEmpleados(dataEmpleados);

                // Inventario
                const productosTransformados = dataInventarios.map((item: any) => ({
                    producto: item.producto.nombre,
                    cantidad: parseInt(item.stockTotal)
                }));

                setInventarios({
                    disponibles: productosTransformados.reduce((sum: any, item: { cantidad: any; }) => sum + item.cantidad, 0),
                    productos: productosTransformados
                });

                // Clientes
                setClientes({ clientesactivos: dataClientes.total });

                // Finalizar carga
                setLoading(false);

            } catch (error) {
                console.error('Error al cargar el dashboard:', error);
                setLoading(false);
            }
        };

        fetchData();
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
            <CapitalDisponibleCard />
            <br />
            <Grid container spacing={3}>
                {[
                    {
                        title: 'Ventas Totales',
                        value: `$${ventas?.total.toLocaleString()} USD`,
                        color: 'gray'
                    },

                    {
                        title: 'Ventas del Mes',
                        value: `$${ventas?.mensuales.find(m => m.actual)?.ventas.toLocaleString()} USD`,
                        color: '#FF9800'
                    },

                    {
                        title: 'Ventas del Día',
                        value: `$${ventas?.diarias.toLocaleString()} USD`,
                        color: '#2196F3'
                    },
                    {
                        title: 'Clientes Activos',
                        value: clientes?.clientesactivos ?? 0,
                        color: '#9C27B0'
                    },
                    {
                        title: 'Inventario Disponible',
                        value: `${inventarios?.disponibles ?? 0} productos`,
                        color: '#009688'
                    },
                    {
                        title: 'Empleados Activos',
                        value: empleados?.total ?? 0,
                        color: '#795548'
                    }
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
                <Card sx={{ borderRadius: 2, boxShadow: 2, width: "100%", marginTop: "20px" }} >

                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Ventas por Mes
                    </Typography>

                    <ResponsiveContainer width="100%" height={200}>

                        <BarChart data={ventas?.mensuales}>

                            <br></br>
                            <XAxis dataKey="mes" stroke="#333" />
                            <YAxis stroke="#333" />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar
                                dataKey="ventas"
                                barSize={50}
                                fill="#4CAF50"
                            >
                                {ventas?.mensuales.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.actual ? "#FF5722" : "#4CAF50"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>






                {/* Gráfico de Inventario por Producto */}

                <Card sx={{ borderRadius: 2, boxShadow: 2, width: "100%", marginTop: "20px" }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Inventario por Producto
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={inventarios?.productos}>
                            <XAxis dataKey="producto" stroke="#333" />
                            <YAxis stroke="#333" />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="cantidad" fill="#2196F3" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>


            </Grid>
        </Box>
    );
};

export default Dashboard;

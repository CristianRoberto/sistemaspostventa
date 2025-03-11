import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Home from "../pages/Home";
import Producto from "../pages/Productos";
import Layout from "../components/Layout"; // Importamos el Layout
import IngresarProducto from "../pages/IngresarProducto";
import Empleados from "../pages/Empleados";
import IngresarEmpleado from "../pages/IngresarEmpleado";
import Clientes from "../pages/Clientes";

import Proveedores from "../pages/Provedores";
import IngresarProvedores from "../pages/IngresarProvedores";
import Carrito from "../pages/Carrito";
import Inventarios from "../pages/Inventarios";
import Ventas from "../pages/Ventas";
import DetallesVenta  from "../pages/DetallesVenta";

import IngresarCliente  from "../pages/IngresarCliente";
import Facturacion from "../pages/Facturacion";



import IngresarInventario from "../pages/IngresarInventario";
import Dashboard from "../pages/Dashboard";
import AperturaTurnoCaja from "../pages/AperturaTurnoCaja";
import CierreCaja from "../pages/CierreCaja";
import AddCategoriaProducto from "../pages/AddCategoriaProducto";
import ListaCompras from "../pages/ListaCompras";
import IngresarCompras from "../pages/IngresarCompras";
import Devoluciones from "../pages/Devoluciones";
import IngresarDevolucion from "../pages/IngresarDevolucion";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas sin Navbar */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registro />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/venta/:id" element={<DetallesVenta />} />

      {/* Rutas con Navbar dentro del Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/productos" element={<Producto />} />
        <Route path="/productos/ingresar" element={<IngresarProducto />} />
        <Route path="/empleados/listar" element={<Empleados />} />
        <Route path="/empleados/nuevo" element={<IngresarEmpleado />} />
        <Route path="/clientes/listar" element={<Clientes />} />
        <Route path="/clientes/nuevo" element={<IngresarCliente />} />
        <Route path="/proveedores/listar" element={<Proveedores />} />
        <Route path="/proveedores/nuevo" element={<IngresarProvedores />} />
        <Route path="/inventario/catalogo" element={<Inventarios />} />
        <Route path="/detalleventa/historial" element={<Ventas />} />
        <Route path="/facturacion/historial" element={<Facturacion />} />

        <Route path="/inventario/agregar" element={<IngresarInventario />} />
        <Route path="/dashboard" element={<Dashboard />} />


        <Route path="/aperturacaja" element={<AperturaTurnoCaja />} />
        <Route path="/cierre_caja/historial" element={<CierreCaja />} />
        <Route path="/addproductoscategoria" element={<AddCategoriaProducto />} />
        <Route path="/compras/listar" element={<ListaCompras />} />
        <Route path="/compras/nueva" element={<IngresarCompras />} />
        <Route path="/devoluciones/historial" element={<Devoluciones />} />
        <Route path="/devoluciones/gestionar" element={<IngresarDevolucion />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;

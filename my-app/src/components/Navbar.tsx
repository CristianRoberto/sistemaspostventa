import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"; // 📌 Asegúrate de importar el archivo CSS aquí
import { Dashboard, Inventory, People, PersonAdd, ShoppingCart, Build, CardGiftcard, Description, Settings, History, PointOfSale, AddShoppingCart, ExitToApp } from "@mui/icons-material"; // Importamos los iconos necesarios de MUI
import { ShoppingBag } from 'lucide-react';
import { Undo, Edit } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';  // Importa el icono de cartera
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null); // Estado para opción seleccionada
  const [openModal, setOpenModal] = useState(false);
  const [utilidad, setUtilidad] = useState<number>(0); // Estado para la utilidad

  // Obtener el rol desde el almacenamiento local (o desde tu sistema de autenticación)
  const userRoleData = localStorage.getItem("UsuarioSesion") || "admin";  // Valor por defecto si no hay rol
  const userRole = userRoleData ? JSON.parse(userRoleData).rol : "admin"; // Acceder al campo 'rol'
  console.log('Rol del usuario:', userRole);  // Agregado para verificar el rol

  // Ejemplo de cómo podrías calcular la utilidad
  useEffect(() => {
    // Simulación de cálculo de utilidad (esto debería venir de tu lógica real)
    const calcularUtilidad = () => {
      // Aquí podrías hacer la lógica para calcular la utilidad basada en las ventas, compras, etc.
      setUtilidad(5000);  // Esta es una utilidad de ejemplo
    };

    calcularUtilidad();
  }, []);

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu); // Actualiza el estado con la opción seleccionada
    setOpenSubMenu(null); // Cerrar todos los submenús al seleccionar un menú
  };

  const handleLogout = () => {
    // Eliminar cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/(.+)=/, "$1=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Eliminar localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirigir al login
    window.location.href = "/login"; // Cambia la URL según tu ruta de login
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "<<" : ">>"}
      </button>
      <ul>
        <li>
          <Link
            to="/dashboard"
            onClick={() => handleMenuClick("dashboard")}
            className={selectedMenu === "dashboard" ? "active-menu" : ""}
          >
            <Dashboard /> {isOpen && "Dashboard"}
          </Link>
        </li>


        {/* Utilidad */}
        <li>
          <div className="menu-item" onClick={() => toggleSubMenu("utilidad")}>
            <span
              className={`menu-link ${selectedMenu === "utilidad" ? "active-menu" : ""}`}
              onClick={() => handleMenuClick("utilidad")}
            >
              <AccountBalanceWalletIcon /> {isOpen && `Utilidad: ${utilidad}`} {/* Muestra la utilidad */}
            </span>
            <span className="submenu-toggle">{openSubMenu === "utilidad" ? "▲" : "▼"}</span>
          </div>
          {isOpen && openSubMenu === "utilidad" && (
            <ul className="submenu">
              {/* Solo para Admin */}
              {userRole === "admin" && (
                <>
                  <li><Link to="/utilidad/"><Description /> Generar Reporte de Utilidad</Link></li>
                  <li><Link to="/utilidad/listado"><PersonAdd /> Resultados de utilidades</Link></li>
                </>
              )}
            </ul>
          )}
        </li>

        {/* Inventario (Solo para Admin) */}
        {userRole === "admin" && (
          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("inventario")}>
              <span
                className={`menu-link ${selectedMenu === "inventario" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("inventario")}
              >
                <Inventory /> {isOpen && "Inventario"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "inventario" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "inventario" && (
              <ul className="submenu">
                <li><Link to="/inventario/catalogo"><Description /> Inventario_Productos</Link></li>
                <li><Link to="/inventario/agregar"><PersonAdd /> Agregar Inventario Producto</Link></li>
              </ul>
            )}
          </li>
        )}



        {/* Empleados */}
        {userRole === "admin" && (
          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("empleados")}>
              <span
                className={`menu-link ${selectedMenu === "empleados" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("empleados")}
              >
                <People /> {isOpen && "Empleados"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "empleados" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "empleados" && (
              <ul className="submenu">
                <li><Link to="/empleados/listar"><Description /> Lista de Empleados</Link></li>
                <li><Link to="/empleados/nuevo"><PersonAdd /> Agregar Empleado</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* Clientes */}
        {userRole === "admin" && (
          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("clientes")}>
              <span
                className={`menu-link ${selectedMenu === "clientes" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("clientes")}
              >
                <People /> {isOpen && "Clientes"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "clientes" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "clientes" && (
              <ul className="submenu">
                <li><Link to="/clientes/listar"><Description /> Lista Clientes</Link></li>
                <li><Link to="/clientes/nuevo"><PersonAdd /> Nuevo Cliente</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* Compras */}
        {userRole === "admin" && (
          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("compras")}>
              <span
                className={`menu-link ${selectedMenu === "compras" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("compras")}
              >
                <ShoppingBag /> {isOpen && "Compras"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "compras" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "compras" && (
              <ul className="submenu">
                <li><Link to="/compras/listar"><Description /> Lista de Compras</Link></li>
                <li><Link to="/compras/nueva"><AddShoppingCart /> Nueva Compra</Link></li>
                <li>
                  <Link to="/addpagoadicional">
                    <AccountBalanceWalletIcon /> Pagos Adicionales
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}


        {/* Proveedores */}
        {userRole === "admin" && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("proveedores")}>
              <span
                className={`menu-link ${selectedMenu === "proveedores" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("proveedores")}
              >
                <CardGiftcard /> {isOpen && "Proveedores"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "proveedores" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "proveedores" && (
              <ul className="submenu">
                <li><Link to="/proveedores/listar"><Description /> Lista Proveedores</Link></li>
                <li><Link to="/proveedores/nuevo"><PersonAdd /> Nuevo Proveedor</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* Productos */}
        {(userRole === "admin" || userRole === "cajero") && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("productos")}>
              <span
                className={`menu-link ${selectedMenu === "productos" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("productos")}
              >
                <ShoppingCart /> {isOpen && "Productos/Orden"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "productos" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "productos" && (
              <ul className="submenu">
                <li><Link to="/productos"><ShoppingCart /> Vender Producto</Link></li>
                <li><Link to="/productos/ingresar"><ShoppingBag /> Agregar Producto</Link></li>
                <li><Link to="/addproductoscategoria"><ShoppingBag /> Categoria_Producto</Link></li>
              </ul>
            )}
          </li>
        )}


        {/* Detalle de Venta */}
        {userRole === "admin" && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("detalleventa")}>
              <span
                className={`menu-link ${selectedMenu === "detalleventa" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("detalleventa")}
              >
                <ShoppingCart /> {isOpen && "Detalle de Venta"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "detalleventa" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "detalleventa" && (
              <ul className="submenu">
                <li><Link to="/detalleventa/historial"><History /> Historial de Ventas</Link></li>
                <li><Link to="/detalleventa/factura"><Description /> Detalle por Factura</Link></li>
              </ul>
            )}
          </li>
        )}


        {/* Detalle de Devoluciones */}
        {(userRole === "admin" || userRole === "cajero") && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("devoluciones")}>
              <span
                className={`menu-link ${selectedMenu === "devoluciones" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("devoluciones")}
              >
                <Undo /> {isOpen && "Devoluciones"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "devoluciones" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "devoluciones" && (
              <ul className="submenu">
                <li><Link to="/devoluciones/historial"><History /> Historial de Devoluciones</Link></li>
                <li><Link to="/devoluciones/gestionar"><Edit /> Gestionar Devoluciones</Link></li>
              </ul>
            )}
          </li>
        )}


        {/* Soporte Técnico */}
        {userRole === "admin" && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("soporte")}>
              <span
                className={`menu-link ${selectedMenu === "soporte" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("soporte")}
              >
                <Build /> {isOpen && "Soporte Técnico"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "soporte" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "soporte" && (
              <ul className="submenu">
                <li><Link to="/soporte/tickets"><Description /> Tickets Abiertos</Link></li>
                <li><Link to="/soporte/nuevo"><PersonAdd /> Crear Ticket</Link></li>
              </ul>
            )}
          </li>
        )}


        {/* Facturación */}
        {userRole === "admin" && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("facturacion")}>
              <span
                className={`menu-link ${selectedMenu === "facturacion" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("facturacion")}
              >
                <Description /> {isOpen && "Facturación"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "facturacion" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "facturacion" && (
              <ul className="submenu">
                <li><Link to="/facturacion/historial"><History /> Historial de Facturas</Link></li>
                <li><Link to="/facturacion/pagos"><Description /> Pagos</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* Cierre Caja */}
        {(userRole === "admin" || userRole === "cajero") && (

          <li>
            <div className="menu-item" onClick={() => toggleSubMenu("cierre_caja")}>
              <span
                className={`menu-link ${selectedMenu === "cierre_caja" ? "active-menu" : ""}`}
                onClick={() => handleMenuClick("cierre_caja")}
              >
                <PointOfSale /> {isOpen && "Cierre de Caja"}
              </span>
              <span className="submenu-toggle">{openSubMenu === "cierre_caja" ? "▲" : "▼"}</span>
            </div>
            {isOpen && openSubMenu === "cierre_caja" && (
              <ul className="submenu">
                <li><Link to="/cierre_caja/historial"><History /> Historial Cierre Caja</Link></li>
                <li><Link to="/aperturacaja"><History /> Inicio Turno Caja</Link></li>
              </ul>
            )}
          </li>
        )}

        {/* Configuración */}
        <li>
          <div className="menu-item" onClick={() => toggleSubMenu("configuracion")}>
            <span
              className={`menu-link ${selectedMenu === "configuracion" ? "active-menu" : ""}`}
              onClick={() => handleMenuClick("configuracion")}
            >
              <Settings /> {isOpen && "Configuración"}
            </span>
            <span className="submenu-toggle">{openSubMenu === "configuracion" ? "▲" : "▼"}</span>
          </div>
          {isOpen && openSubMenu === "configuracion" && (
            <ul className="submenu">
              <li><Link to="/configuracion/usuarios"><People /> Usuarios</Link></li>
              <li><Link to="/configuracion/roles"><Description /> Roles y Permisos</Link></li>
            </ul>
          )}
        </li>

        {/* Cerrar Sesión */}
        <li>
          <div className="menu-item" onClick={handleOpenModal}>
            <span
              className={`menu-link ${selectedMenu === "logout" ? "active-menu" : ""}`}
              onClick={() => handleMenuClick("logout")}
            >
              <ExitToApp /> Cerrar Sesión
            </span>
          </div>
        </li>






      </ul>



      {/* Modal de Confirmación */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-logout"
        aria-describedby="confirm-logout-description"
      >
        <DialogTitle id="confirm-logout">Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas cerrar sesión? Todos los datos de la sesión se perderán.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" variant="contained"

          >
            No
          </Button>
          <Button onClick={handleLogout}
            variant="contained"
            color="primary"
          >
            Sí, cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Navbar;

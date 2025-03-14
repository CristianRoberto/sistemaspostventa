const Producto = require("./producto");
const Inventario = require("./inventario");
const Empleado = require("./empleado");
const Cliente = require("./cliente");
const Venta = require("./venta");
const DetalleVenta = require("./detalleventa");
const Categoria = require("./categoria");
const Factura = require("./factura");
const CierreCaja = require("./cierrecaja");
const Proveedor = require("./provedores");
const CompraProducto = require("./CompraProducto");
const Devolucion = require("./devolucion");
const PagoAdicional = require("./pagoAdicional"); // Asegúrate de importar el modelo PagoAdicional

// Función para inicializar los modelos y relaciones
const initModels = (sequelize) => {
  // Relación entre CompraProducto y Proveedor (Muchos a Uno)
  Proveedor.hasMany(CompraProducto, { foreignKey: "id_proveedor", as: "compras" });
  CompraProducto.belongsTo(Proveedor, { foreignKey: "id_proveedor", as: "proveedor" });

  // Relación entre CompraProducto y Producto (Muchos a Uno)
  Producto.hasMany(CompraProducto, { foreignKey: "producto_id", as: "compras" });
  CompraProducto.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

  // Relación entre DetalleVenta y CompraProducto (Muchos a Uno)
  CompraProducto.hasMany(DetalleVenta, { foreignKey: "compra_producto_id", as: "detalles" });
  DetalleVenta.belongsTo(CompraProducto, { foreignKey: "compra_producto_id", as: "compra" });

  // Relación entre Producto e Inventario (Uno a Muchos)
  Producto.hasMany(Inventario, { foreignKey: "producto_id", as: "inventarios" });
  Inventario.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

  // Relación entre Empleado e Inventario (Uno a Muchos)
  Empleado.hasMany(Inventario, { foreignKey: "empleado_id", as: "inventarios" });
  Inventario.belongsTo(Empleado, { foreignKey: "empleado_id", as: "empleado" });

  // Relación entre Cliente y Venta (Uno a Muchos)
  Cliente.hasMany(Venta, { foreignKey: "cliente_id", as: "ventas" });
  Venta.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });

  // Relación entre Empleado y Venta (Uno a Muchos)
  Empleado.hasMany(Venta, { foreignKey: "empleado_id", as: "ventas" });
  Venta.belongsTo(Empleado, { foreignKey: "empleado_id", as: "empleado" });

  // Relación entre Venta y DetalleVenta (Uno a Muchos)
  Venta.hasMany(DetalleVenta, { foreignKey: "venta_id", as: "detalles" });
  DetalleVenta.belongsTo(Venta, { foreignKey: "venta_id", as: "venta" });

  // Relación entre DetalleVenta y Producto (Uno a Muchos)
  Producto.hasMany(DetalleVenta, { foreignKey: "producto_id", as: "detalles" });
  DetalleVenta.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

  // Relación Producto -> Categoria (Muchos a Uno)
  Producto.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });
  Categoria.hasMany(Producto, { foreignKey: "categoria_id", as: "productos" });

  // Relación entre Factura y Venta (Uno a Uno)
  Factura.belongsTo(Venta, { foreignKey: "venta_id", onDelete: "CASCADE", as: "venta" });
  Venta.hasOne(Factura, { foreignKey: "venta_id", as: "factura" });

  // Relación entre Factura y Cliente (Uno a Muchos, cada factura pertenece a un cliente)
  Factura.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });
  Cliente.hasMany(Factura, { foreignKey: "cliente_id", as: "facturas" });

  // Relación entre DetalleVenta y Factura (Uno a Muchos, una factura puede tener varios detalles)
  Factura.hasMany(DetalleVenta, { foreignKey: "factura_id", as: "detalles" });
  DetalleVenta.belongsTo(Factura, { foreignKey: "factura_id", as: "factura" });

  // Relación entre CierreCaja y Empleado (Muchos a Uno)
  CierreCaja.belongsTo(Empleado, { foreignKey: "empleado_id", as: "empleado" });
  Empleado.hasMany(CierreCaja, { foreignKey: "empleado_id", as: "cierresCaja" });

  // Relación entre Venta y Devolucion (Uno a Muchos)
  Venta.hasMany(Devolucion, { foreignKey: "venta_id", as: "devoluciones" });
  Devolucion.belongsTo(Venta, { foreignKey: "venta_id", as: "venta" });

  // Relación entre Producto y Devolucion (Uno a Muchos)
  Producto.hasMany(Devolucion, { foreignKey: "producto_id", as: "devoluciones" });
  Devolucion.belongsTo(Producto, { foreignKey: "producto_id", as: "producto" });

  // Relación entre PagoAdicional y Proveedor (Muchos a Uno)
  Proveedor.hasMany(PagoAdicional, { foreignKey: "id_proveedor", as: "pagosAdicionales" });
  PagoAdicional.belongsTo(Proveedor, { foreignKey: "id_proveedor", as: "proveedor" });

  // Relación entre PagoAdicional y Empleado (Muchos a Uno)
  Empleado.hasMany(PagoAdicional, { foreignKey: "empleado_id", as: "pagosAdicionales" });
  PagoAdicional.belongsTo(Empleado, { foreignKey: "empleado_id", as: "empleado" });

  // Relación entre PagoAdicional y Cliente (Muchos a Uno)
  Cliente.hasMany(PagoAdicional, { foreignKey: "cliente_id", as: "pagosAdicionales" });
  PagoAdicional.belongsTo(Cliente, { foreignKey: "cliente_id", as: "cliente" });

  return { 
    Empleado, Categoria, Producto, Inventario, Cliente, Venta, DetalleVenta, Factura, 
    CierreCaja, Devolucion, PagoAdicional, Proveedor, CompraProducto 
  };
};

module.exports = initModels;

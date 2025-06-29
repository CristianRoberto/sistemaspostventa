const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetalleVenta = sequelize.define('DetalleVenta', {
  detalle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',  // Asegúrate de que el modelo se llame 'Venta' en Sequelize
      key: 'venta_id',
    },
    onDelete: 'CASCADE',
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',  // Asegúrate de que el modelo se llame 'Producto' en Sequelize
      key: 'producto_id',
    },
    onDelete: 'CASCADE',
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.cantidad * this.precio;
    },
  },
  factura_id: {
    type: DataTypes.INTEGER,
    allowNull: true,  
    references: {
      model: 'facturas',  // Asegúrate de que el modelo se llame 'Factura' en Sequelize
      key: 'factura_id',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'detalle_venta',
  timestamps: false,
});

module.exports = DetalleVenta;

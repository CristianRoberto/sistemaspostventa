const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetalleVenta = sequelize.define('Detalleventa', {
  detalle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',
      key: 'venta_id',
    },
    onDelete: 'CASCADE',
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
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
    allowNull: true,  // Permitimos que sea nulo por si no siempre se asocia a una factura
    references: {
      model: 'facturas',
      key: 'factura_id',
    },
    onDelete: 'SET NULL',  // Si la factura es eliminada, no eliminar el detalle de la venta
  },
}, {
  tableName: 'detalle_venta',
  timestamps: false,
});

module.exports = DetalleVenta;

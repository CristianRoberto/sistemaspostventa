const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const moment = require('moment-timezone');

// Definir el modelo Devolucion
const Devolucion = sequelize.define('Devolucion', {
  devolucion_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',
      key: 'venta_id',
    },
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'producto_id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motivo_devolucion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  monto_devolucion: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha_devolucion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => moment().tz('America/Guayaquil').toDate(), // Usar toDate() para devolver un objeto Date
  },
}, {
  tableName: 'devoluciones',
  timestamps: false,
});

module.exports = Devolucion;

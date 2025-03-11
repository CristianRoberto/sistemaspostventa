const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Conexión a la BD
const Venta = require('./venta'); // Importamos el modelo Venta

const dayjs = require('dayjs'); // Importar Day.js
const utc = require('dayjs/plugin/utc'); // Importar el plugin de UTC
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin de zonas horarias

// Extender Day.js con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const Factura = sequelize.define('Factura', {
  factura_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Venta,
      key: 'venta_id',
    },
  },
  numero_factura: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => dayjs().tz("America/Guayaquil").toDate(), // Usando Day.js con zona horaria
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => dayjs().tz("America/Guayaquil").add(30, 'day').toDate(), // Sumar 30 días a la fecha de emisión
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  impuestos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  estado_pago: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'facturas',
  timestamps: false, // Deshabilitamos createdAt y updatedAt
  hooks: {
    beforeCreate: (factura, options) => {
      // No es necesario establecer la fecha de vencimiento aquí,
      // ya que se establece automáticamente en la definición de la columna
    },
  },
});

module.exports = Factura;

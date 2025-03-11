const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./empleado'); // Suponiendo que tienes el modelo de Empleado

const dayjs = require('dayjs'); // Importar Day.js
const utc = require('dayjs/plugin/utc'); // Importar el plugin de UTC
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin de zonas horarias

// Extender Day.js con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CierreCaja = sequelize.define('CierreCaja', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_apertura: {
    type: DataTypes.DATE,
    defaultValue: () => dayjs().tz("America/Guayaquil").format('YYYY-MM-DD HH:mm:ss'),
  },
  fecha_cierre: {
    type: DataTypes.DATE,
    // defaultValue: () => dayjs().tz("America/Guayaquil").format('YYYY-MM-DD HH:mm:ss'),
  },
  monto_inicial: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_ventas: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00 // Valor predeterminado
  },
  efectivo_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00 // Valor predeterminado
  },
  tarjeta_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00 // Valor predeterminado
  },
  diferencia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00 // Valor predeterminado
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'empleados', // Nombre de la tabla de empleados
      key: 'id'
    },
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'abierto', // Se puede actualizar a 'cerrado' cuando se cierre
  },
  
  total_cierrecaja_efectivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
}

}, {
  tableName: 'cierres_caja',
  timestamps: false
});


module.exports = CierreCaja;

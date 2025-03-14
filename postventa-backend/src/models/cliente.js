const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según tu configuración
const dayjs = require('dayjs'); // Importar Day.js
const utc = require('dayjs/plugin/utc'); // Importar el plugin de UTC
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin de zonas horarias

// Extender Day.js con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const Cliente = sequelize.define('Cliente', {
  cliente_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true,
    },
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  direccion: {
    type: DataTypes.TEXT,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: () => dayjs().tz("America/Guayaquil").format('YYYY-MM-DD HH:mm:ss'),
  },
  estado: {
    type: DataTypes.STRING(10),
    defaultValue: 'activo',
  },
  tipo_cliente: {
    type: DataTypes.STRING(20),
  },
  ruc_cedula: {
    type: DataTypes.STRING(20),
  },
  metodo_contacto_preferido: {
    type: DataTypes.STRING(20),
  },
  ultima_compra: {
    type: DataTypes.DATE,
    defaultValue: () => dayjs().tz("America/Guayaquil").format('YYYY-MM-DD HH:mm:ss'),
  },
  total_compras: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  observaciones: {
    type: DataTypes.TEXT,
  },
  nivel_satisfaccion: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 10,
    },
  },
  cantidad_reclamos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_puntos_acumulados: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Asegúrate de que tenga un valor por defecto
  }
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;

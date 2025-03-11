// models/CompraProducto.js
const { DataTypes, Sequelize } = require('sequelize'); // Agregar Sequelize aquí
const sequelize = require("../config/db"); // Ajusta la ruta según tu estructura

const dayjs = require('dayjs'); // Importar Day.js
const utc = require('dayjs/plugin/utc'); // Importar el plugin de UTC
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin de zonas horarias

// Extender Day.js con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Definimos el modelo CompraProducto
const CompraProducto = sequelize.define('CompraProducto', {
  id_compras_productos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero_factura: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',  // Nombre de la tabla de productos
      key: 'producto_id',  // Clave primaria de la tabla Productos
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha_compra: {
    type: DataTypes.DATE, // Si deseas solo la fecha
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Ahora Sequelize está definido
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proveedores',  // Nombre de la tabla de proveedores
      key: 'id_proveedores',  // Clave primaria de la tabla Proveedores
    },
  },
}, {
  tableName: 'compras_productos',  // Nombre de la tabla en la base de datos
  timestamps: false,  // Si la tabla no tiene los campos createdAt y updatedAt
});

module.exports = CompraProducto;

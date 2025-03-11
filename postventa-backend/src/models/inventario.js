const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Asegúrate de que esta es la conexión correcta
const Producto = require("./producto");


const Inventario = sequelize.define('Inventario', {
  id_inventarios: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  producto_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'productos',
      key: 'producto_id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_movimiento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado_producto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  precio_unitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // cantidad_actual: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  motivo_movimiento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  referencia_externa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'inventarios',
  timestamps: false,
});




module.exports = Inventario;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Asegúrate de que esta es la conexión correcta

const Producto = sequelize.define('Producto', {
  producto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'categorias',
      key: 'categoria_id',
    },
  },
  imagenproducto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

module.exports = Producto;

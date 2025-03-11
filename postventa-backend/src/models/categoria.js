const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Conexión a la base de datos

const Categoria = sequelize.define('Categoria', {
  categoria_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'categoria_id', // Indicar el nombre exacto de la columna en la base de datos
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'nombre',
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'descripcion',
  },
}, {
  tableName: 'categorias',
  timestamps: false, // Si no tienes columnas de tiempo (createdAt/updatedAt)
});

module.exports = Categoria;

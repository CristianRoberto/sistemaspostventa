const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Conexión a la base de datos

const Capital = sequelize.define('Capital', {
  id_capital: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'capital', // Nombre de la tabla en la base de datos
  timestamps: true,  // Esto habilita las columnas `createdAt` y `updatedAt`
  createdAt: 'createdat',  // Mapea `createdAt` de Sequelize a `createdat` en la base de datos
  updatedAt: 'updatedat',  // Mapea `updatedAt` de Sequelize a `updatedat` en la base de datos
});

module.exports = Capital;

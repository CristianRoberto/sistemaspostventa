// models/Empleado.js
const sequelize = require('../config/db');  // Ajusta la ruta según tu configuración de Sequelize
const { Model, DataTypes } = require('sequelize');

// Definimos el modelo Empleado
const Empleado = sequelize.define('Empleado', {
  empleado_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cedula: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,  // La cédula debe ser única
    validate: {
      len: [10, 10],  // La cédula ecuatoriana tiene 10 dígitos
      isNumeric: true,  // Solo debe contener números
    },
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: true,  // La columna puede ser null
  },
  direccion: {
    type: DataTypes.STRING(500),
    allowNull: true,  // La dirección puede ser null
  },
  puesto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isNumeric: true,  // Solo debe contener números
      len: [7, 20],     // Validar longitud de teléfono (ajusta según el formato)
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,  // Validación de email
    },
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),  // Salario con hasta 10 dígitos y 2 decimales
    allowNull: false,
    validate: {
      min: 0,  // No puede ser negativo
    },
  },
  
}, {
  tableName: 'empleados',  // Nombre de la tabla en la base de datos
  timestamps: false,  // Si la tabla no tiene los campos createdAt y updatedAt
});

module.exports = Empleado;  // Exportamos el modelo para usarlo en otras partes

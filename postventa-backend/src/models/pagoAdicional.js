const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que esta ruta sea la correcta

const PagoAdicional = sequelize.define('PagoAdicional', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  concepto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo_pago: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'proveedores', // Relación con la tabla proveedores
      key: 'id_proveedores',
    },
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'pagosadicionales', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva los campos createdAt y updatedAt
});


module.exports = PagoAdicional;

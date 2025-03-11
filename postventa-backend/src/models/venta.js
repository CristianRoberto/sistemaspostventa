const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Conexión a la base de datos
const moment = require('moment-timezone');

// Definir el modelo Venta
const Venta = sequelize.define('Venta', {
  venta_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cambiar a false si cliente_id es obligatorio
    references: {
      model: 'clientes',
      key: 'cliente_id',
    },
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cambiar a false si empleado_id es obligatorio
    references: {
      model: 'empleados',
      key: 'empleado_id',
    },
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  descuento: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  impuestos: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 12.00, 15.00]], // 🔹 Asegurar que coincida con la BD
        msg: 'El valor de impuestos debe ser 0, 12.00 o 15.00',
      },
    },
  },
  metodo_pago: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    // validate: {
    //   isIn: [['pendiente', 'completada', 'cancelada', 'pagada']]
    // },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss'), // Usar moment directamente para obtener la hora de Ecuador
  },
  total_neto: {
    type: DataTypes.VIRTUAL,
    get() {
      const total = parseFloat(this.getDataValue('total')) || 0;
      const descuento = parseFloat(this.getDataValue('descuento')) || 0;
      const impuestos = parseFloat(this.getDataValue('impuestos')) || 0;
      return total - descuento + impuestos;
    },
  },
}, {
  tableName: 'ventas',
  timestamps: false, // Configúralo en true si necesitas createdAt y updatedAt
});

module.exports = Venta;

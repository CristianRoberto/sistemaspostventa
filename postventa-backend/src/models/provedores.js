const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Conexión a la base de datos



const Proveedor = sequelize.define('Proveedor', {
  id_proveedores: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_proveedores', // Nombre exacto de la columna en la base de datos
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'nombre',
  },
  apellidos_proveedor: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'apellidos_proveedor',
  },
  tipo_proveedor: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'tipo_proveedor',
  },
  ruc_cif: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'ruc_cif',
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'telefono',
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'correo_electronico',
  },
  direccion_fisica: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'direccion_fisica',
  },
  persona_contacto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'persona_contacto',
  },
  telefono_contacto: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'telefono_contacto',
  },
  plazo_pago: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'plazo_pago', // Plazo de pago en días
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'metodo_pago',
  },
  moneda: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'moneda',
  },
  descuento_volumen: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'descuento_volumen',
  },
  condiciones_entrega: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'condiciones_entrega',
  },
  fecha_ultimo_pedido: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_ultimo_pedido',
  },
  monto_total_compras: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    field: 'monto_total_compras',
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'activo', // Por defecto 'activo'
    field: 'estado',
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'calificacion',
  },
  historico_devoluciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'historico_devoluciones',
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'creado_en',
  },
  actualizado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'actualizado_en',
    onUpdate: DataTypes.NOW,
  },
}, {
  tableName: 'proveedores',
  timestamps: false, // Si no tienes columnas 'createdAt' y 'updatedAt'
});

module.exports = Proveedor;

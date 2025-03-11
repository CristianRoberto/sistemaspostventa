const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que la ruta es correcta
const Empleado = require('./empleado'); // Importa el modelo de Empleado


const dayjs = require('dayjs'); // Importar Day.js
const utc = require('dayjs/plugin/utc'); // Importar el plugin de UTC
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin de zonas horarias

// Extender Day.js con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);


const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cedula: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    nombre_usuario: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    rol: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
    defaultValue: () => dayjs().tz("America/Guayaquil").toDate(), // Usando Day.js con zona horaria y devolviendo un objeto Date
    },
    empleado_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'empleados', // Nombre de la tabla en la base de datos
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }
}, {
    tableName: 'usuarios', // Especifica el nombre de la tabla
    timestamps: false, // Evita que Sequelize agregue createdAt y updatedAt
});

// Definir la relación con Empleado
Usuario.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });

module.exports = Usuario;

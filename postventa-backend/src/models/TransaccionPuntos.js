const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que la ruta es correcta

const TransaccionPuntos = sequelize.define('TransaccionPuntos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo_accion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'transacciones_puntos', // Especifica el nombre de la tabla
    timestamps: false, // Evita que Sequelize agregue createdAt y updatedAt
});

module.exports = TransaccionPuntos;

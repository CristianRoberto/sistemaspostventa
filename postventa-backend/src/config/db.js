require('dotenv').config();
const { Sequelize } = require('sequelize');

// Conexión a la base de datos con variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,  // Configuración de SSL si es necesario
    timezone: '-05:00', // Establece la zona horaria de Ecuador

  }
);

// Verificar la conexión
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa!');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);  // Detener la ejecución si la conexión falla
  }
};

testDbConnection();

module.exports = sequelize;

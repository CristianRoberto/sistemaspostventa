const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const initModels = require('../postventa-backend/src/models/initModels.js');  // Asegúrate de importar initModels.js

const app = express();

const path = require('path');

const moment = require('moment-timezone');

moment.tz.setDefault("America/Guayaquil");
// Establece la zona horaria de Ecuador en Node.js
process.env.TZ = 'America/Guayaquil';





// Servir los archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Llamar a initModels antes de cualquier consulta a la base de datos
initModels();

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Usar el puerto desde la variable de entorno o establecer un valor predeterminado
const PORT = process.env.PORT || 5000;  // Si no se encuentra PORT, usará 5000 como predeterminado

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors({
  origin: ['http://localhost:5000',
    'http://gamebrag.onrender.com',
    'https://gamebrag.onrender.com'], credentials: true
}));

// Analizar solicitudes con express.json y express.urlencoded
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));

// Rutas
app.use(require('./src/routes/index.js'));
app.use(require('./src/routes/empleadoRoutes.js'));
app.use(require('./src/routes/clientesRoutes.js'));
app.use(require('./src/routes/provedoreRoutes.js'));


app.use(require('./src/routes/resumenVentaRoutes.js'));
app.use(require('./src/routes/provedoreRoutes.js'));
app.use(require('./src/routes/inventario.js'));
app.use(require('./src/routes/detalleVentaRoutes.js'));
app.use(require('./src/routes/productoRoutes.js'));
app.use(require('./src/routes/facturasRoutes.js'));
app.use(require('./src/routes/CompraProductoRoutes.js'));
app.use(require('./src/routes/cierrecajaRoutes.js'));
app.use(require('./src/routes/devolucionRoutes.js'));
app.use(require('./src/routes/pagosRoutes.js'));
app.use(require('./src/routes/capitalRoutes.js'));
app.use(require('./src/routes/utilidadDiariaRoutes.js'));








app.listen(PORT, () => {
  console.log(`App lista en el puerto ${PORT}`);
});

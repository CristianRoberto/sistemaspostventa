// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {obtenerResumenVentas,
     obtenerResumenVentasMensuales} = require('../controllers/resumenventaController');

// Rutas del inventario
router.get('/ventastotales', obtenerResumenVentas); // Llamada GET con fecha en query
router.get('/resumenmensual', obtenerResumenVentasMensuales);





module.exports = router;

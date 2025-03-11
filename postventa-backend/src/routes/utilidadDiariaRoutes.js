

// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {calcularUtilidadDiaria

} = require('../controllers/utilidaDiariaController');

// Rutas del inventario
router.get('/utilidad', calcularUtilidadDiaria); // Llamada GET con fecha en query






module.exports = router;

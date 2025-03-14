// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {calcularUtilidadDiaria, verUtilidadDiaria

} = require('../controllers/utilidaDiariaController');

// Rutas del inventario
router.post('/utilidad', calcularUtilidadDiaria); // Llamada GET con fecha en query

router.get('/utilidad', verUtilidadDiaria); // Llamada GET con fecha en query







module.exports = router;

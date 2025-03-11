

// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {obtenerDevolucion,crearDevolucion , editarDevolucion, eliminarDevolucion} = require('../controllers/devolucionController');

// Rutas del inventario
router.get('/devoluciones', obtenerDevolucion); // Llamada GET con fecha en query

// Rutas para devoluciones
router.get('/devoluciones', obtenerDevolucion);
router.post('/devoluciones', crearDevolucion);
router.put('/devoluciones/:devolucion_id', editarDevolucion);
router.delete('/devoluciones/:devolucion_id', eliminarDevolucion);

module.exports = router;

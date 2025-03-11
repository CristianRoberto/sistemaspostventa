// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {
obtenerPago,
insertarPago

} = require('../controllers/pagoController');

// Rutas del inventario
router.get('/obtenerpagos', obtenerPago); // Obtener todos los PagosAdicionales
router.post('/pagos', insertarPago); // Crear un nuevo PagosAdicionales

// router.get('/inventarios/:id_inventarios', obtenerInventarioPorId); // Obtener inventario por ID
// router.put('/inventarios/:id_inventarios', actualizarInventarioPorId); // Actualizar inventario por ID
// router.delete('/inventarios/:id_inventarios', eliminarInventarioPorId); // Eliminar inventario por ID
// router.delete('/inventarios/', eliminarInventarios); // Eliminar todos los inventarios


// router.get('/inventariosstock/:producto_id', verificarStockBajo); // Obtener todos los inventarios


// app.use("/api", stockRoutes);


module.exports = router;

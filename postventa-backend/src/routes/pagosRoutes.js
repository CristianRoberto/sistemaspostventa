// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {
obtenerPago,
insertarPago,
actualizarPago,
eliminarPago

} = require('../controllers/pagoController');

// Rutas del inventario
router.get('/obtenerpagos', obtenerPago); // Obtener todos los PagosAdicionales
router.post('/Ingresarpagos', insertarPago); // Crear un nuevo PagosAdicionales

router.put('/actualizarpago/:id_pago', actualizarPago); // Actualizar un pago adicional
router.delete('/eliminarpago/:id_pago', eliminarPago); // Eliminar un pago adicional


// router.get('/inventarios/:id_inventarios', obtenerInventarioPorId); // Obtener inventario por ID
// router.put('/inventarios/:id_inventarios', actualizarInventarioPorId); // Actualizar inventario por ID
// router.delete('/inventarios/:id_inventarios', eliminarInventarioPorId); // Eliminar inventario por ID
// router.delete('/inventarios/', eliminarInventarios); // Eliminar todos los inventarios


// router.get('/inventariosstock/:producto_id', verificarStockBajo); // Obtener todos los inventarios


// app.use("/api", stockRoutes);


module.exports = router;

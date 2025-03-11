// routes/inventarioRoutes.js
const { Router } = require('express');
const router = Router();

// Importar controlador
const {
  obtenerInventarios,
  obtenerInventarioPorId,
  agregarInventario,
  actualizarInventarioPorId,
  eliminarInventarioPorId,
  eliminarInventarios,
  verificarStockBajo
} = require('../controllers/inventarioController');

// Rutas del inventario
router.get('/inventarios', obtenerInventarios); // Obtener todos los inventarios
router.get('/inventarios/:id_inventarios', obtenerInventarioPorId); // Obtener inventario por ID
router.post('/inventarios', agregarInventario); // Crear un nuevo inventario
router.put('/inventarios/:id_inventarios', actualizarInventarioPorId); // Actualizar inventario por ID
router.delete('/inventarios/:id_inventarios', eliminarInventarioPorId); // Eliminar inventario por ID
router.delete('/inventarios/', eliminarInventarios); // Eliminar todos los inventarios


router.get('/inventariosstock/:producto_id', verificarStockBajo); // Obtener todos los inventarios


// app.use("/api", stockRoutes);


module.exports = router;

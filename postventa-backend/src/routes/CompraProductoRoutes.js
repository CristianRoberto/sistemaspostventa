const { Router } = require('express');
const router = Router();

const {
    crearCompra,
    obtenerCompra,
    editarCompra,
    eliminarCompra
} = require('../controllers/CompraProductoController');

// Definir las rutas
router.post('/compraproducto', crearCompra); // Crear una nueva compra
router.get('/compraproducto', obtenerCompra); // Obtener todas las compras
router.put('/compraproducto/:id_compras_productos', editarCompra); // Editar una compra existente
router.delete('/compraproducto/:id_compras_productos', eliminarCompra); // Eliminar una compra

module.exports = router;

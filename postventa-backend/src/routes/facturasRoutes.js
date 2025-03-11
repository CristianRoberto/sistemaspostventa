const { Router } = require('express');
const router = Router();

const {
  obtenerFactura,
//   crearFactura,
//   obtenerFacturaPorId,
//   eliminarFactura
} = require('../controllers/facturaController');


// Definir las rutas
router.get('/facturas', obtenerFactura); // Obtener todas las facturas
// er.post('/facturas', crearFactura); // Crear una factura
// router.get('/facturas/:id', obtenerFacturaPorId); // Obtener una factura por ID
// router.delete('/facturas/:id', eliminarFactura); // Eliminar una facturarout

module.exports = router;

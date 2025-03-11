const { Router } = require('express');
const router = Router();

const { agregarDetalleVenta, obtenerDetalleVenta } = require('../controllers/detalleventaController');


//router Ventas
router.get('/detalleVenta', obtenerDetalleVenta);
router.post('/detalleVenta', agregarDetalleVenta);
// router.post('/ventas', crearVenta);
// router.get('/ventas/:venta_id', obtenerVentasPorId);
// router.delete('/ventas/:venta_id', eliminarVentasPorId);
// router.delete('/ventas/', eliminarVentas);
// router.put('/ventas/:venta_id', actualizarVentasPorId);



module.exports = router;

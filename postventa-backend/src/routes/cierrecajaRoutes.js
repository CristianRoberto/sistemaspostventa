const { Router } = require('express');
const router = Router();

const {
  cerrarCaja,
  obtenerCierreCaja,
  inicioCaja
//   crearFactura,
//   obtenerFacturaPorId,
//   eliminarFactura
} = require('../controllers/cierrecajaController');


// Definir las rutas
router.post('/aperturacaja', inicioCaja); // Obtener todas las CierreCaja
router.get('/aperturacaja', obtenerCierreCaja); // Obtener todas las CierreCaja

router.post('/cerrarcaja', cerrarCaja); // Obtener todas las CierreCaja


module.exports = router;

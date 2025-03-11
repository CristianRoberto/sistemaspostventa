const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const { obtenerEmpleado, agregarEmpleado, eliminarEmpleadoId , actualizarempleadoPorId} = require('../controllers/empleadoController');



//router Empleados
router.get('/empleado', obtenerEmpleado);
router.post('/empleado',  agregarEmpleado); // Usa el middleware de multer aquí
router.delete('/empleado/:empleado_id', eliminarEmpleadoId)
router.put('/empleado/:empleado_id', actualizarempleadoPorId)

module.exports = router;
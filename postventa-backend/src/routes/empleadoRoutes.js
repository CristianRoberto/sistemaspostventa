const express = require("express");
const router = express.Router();
const { 
    obtenerEmpleado, 
    agregarEmpleado, 
    eliminarEmpleadoId, 
    actualizarempleadoPorId, 
    obtenerEmpleadoPorCedula ,
    obtenerTotalEmpleados
} = require("../controllers/empleadoController");

router.get('/empleado', obtenerEmpleado); // Obtener todos los empleados
router.get('/empleado/:cedula', obtenerEmpleadoPorCedula); // Buscar empleado por cédula
router.post('/empleado', agregarEmpleado); // Agregar nuevo empleado
router.delete('/empleado/:empleado_id', eliminarEmpleadoId); // Eliminar empleado por ID
router.put('/empleado/:empleado_id', actualizarempleadoPorId); // Actualizar empleado por ID
router.get('/totalempleados', obtenerTotalEmpleados);


module.exports = router;

const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');



const {
    defectoCategorias, obtenerCategorias, agregarCategoria, obtenerCategoriaPorId, eliminarCategoriaPorId,
    eliminarCategorias, actualizarCategoriaPorId } = require('../controllers/categoriaController');


const {
        obtenerVentas,  obtenerVentasPorId, eliminarVentasPorId,
        eliminarVentas, actualizarVentasPorId, crearVenta } = require('../controllers/ventaController');


const { obtenerEmpleado, agregarEmpleado }= require('../controllers/empleadoController');
const {registerController, login, obtenerRegister } = require('../controllers/login');


//route login
router.post('/login', login); // No uses GET para login, usa POST
router.post('/register', registerController); // Usar POST para el registro
router.get('/register', obtenerRegister);






//router Categorias
router.get('/', defectoCategorias);
router.get('/categorias', obtenerCategorias);
router.post('/categorias', agregarCategoria);
router.get('/categorias/:categoria_id', obtenerCategoriaPorId);
router.delete('/categorias/:categoria_id', eliminarCategoriaPorId);
router.delete('/categorias/', eliminarCategorias);
router.put('/categorias/:categoria_id', actualizarCategoriaPorId);




//router Ventas
router.get('/ventas', obtenerVentas);
router.post('/ventas', crearVenta);
router.get('/ventas/:venta_id', obtenerVentasPorId);
router.delete('/ventas/:venta_id', eliminarVentasPorId);
router.delete('/ventas/', eliminarVentas);
router.put('/ventas/:venta_id', actualizarVentasPorId);




//router Empleados
router.get('/empleado', obtenerEmpleado);
router.post('/empleado', agregarEmpleado);







module.exports = router;
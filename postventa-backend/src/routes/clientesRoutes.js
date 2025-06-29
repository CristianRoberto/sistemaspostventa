const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');

const {
    obtenerClientes, agregarCliente, obtenerClientePorId, eliminarClientePorId,
    eliminarClientes, actualizarClientePorId , obtenerTotalCliente
} = require('../controllers/clienteController');


//router Clientes
router.get('/clientes', obtenerClientes);
router.post('/clientes', agregarCliente);
router.get('/clientes/:cliente_id', obtenerClientePorId);
router.delete('/clientes/:cliente_id', eliminarClientePorId);
router.delete('/clientes/', eliminarClientes);
router.put('/clientes/:cliente_id', actualizarClientePorId);

router.get('/totalcliente', obtenerTotalCliente);



module.exports = router;
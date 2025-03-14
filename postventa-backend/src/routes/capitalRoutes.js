const express = require('express');
const router = express.Router();
const { crearOActualizarCapital, verCapital } = require('../controllers/capitalController');

// Ruta para crear o actualizar el capital
router.post('/capital', crearOActualizarCapital);
router.get('/capital', verCapital);


module.exports = router;

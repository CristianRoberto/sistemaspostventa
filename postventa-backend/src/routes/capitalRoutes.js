const express = require('express');
const router = express.Router();
const { crearOActualizarCapital } = require('../controllers/capitalController');

// Ruta para crear o actualizar el capital
router.post('/capital', crearOActualizarCapital);

module.exports = router;

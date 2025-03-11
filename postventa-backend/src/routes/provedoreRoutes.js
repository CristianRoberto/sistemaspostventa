const { Router } = require('express');
const router = Router();
// const multer = require('multer');
// const path = require('path');
const { obtenerProvedor,
    agregarProvedor,
    actualizarProvedorPorId,
    eliminarProvedorPorId } = require('../controllers/provedoresController');


// // Configuración de Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');  // Asegúrate de que la carpeta "uploads" exista
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

//router Empleados
router.get('/proveedor', obtenerProvedor);
router.post('/proveedor', agregarProvedor); // Usa el middleware de multer aquí
router.delete('/proveedor/:id_proveedores', eliminarProvedorPorId)
router.put('/proveedor/:id_proveedores', actualizarProvedorPorId)


module.exports = router;
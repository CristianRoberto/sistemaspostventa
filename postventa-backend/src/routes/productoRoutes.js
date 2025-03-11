const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');


const { agregarProducto, obtenerProductos, obtenerProductoPorId, eliminarProductoPorId,
    eliminarProductos, actualizarProductoPorId } = require('../controllers/productoController');


// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directorio donde se almacenarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada imagen
    }
});




const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        return cb(new Error('Solo se permiten imágenes JPG, JPEG o PNG.'));
      }
      cb(null, true);
    },
  });
  router.post('/productos', upload.single('imagenproducto'), agregarProducto); // Usamos el middleware de multer aquí


//router Productos
router.get('/productos', obtenerProductos);
router.get('/productos/:producto_id', obtenerProductoPorId);
router.delete('/productos/:producto_id', eliminarProductoPorId);
router.delete('/productos/', eliminarProductos);
router.put('/productos/:producto_id', actualizarProductoPorId)


module.exports = router;
const Detalleventa = require('../models/detalleventa');  //  de que el modelo esté correctamente importado
const Venta = require('../models/venta');
const Producto = require('../models/producto');



const obtenerDetalleVenta = async (req, res) => {
  try {
    const Detalle_venta = await Detalleventa.findAll({
      include: [
        {
          model: Venta,
          as: 'venta',  // Si usas alias, debes agregarlo aquí
          required: true
        },
        {
          model: Producto,
          as: 'producto',  // Si usas alias, debes agregarlo aquí
          required: true
        }
      ] 
    });
    return res.status(200).json(Detalle_venta);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};




// Función para agregar un detalle de venta
const agregarDetalleVenta = async (req, res) => {
  try {
    const { venta_id, producto_id, cantidad, precio } = req.body;

    // Validamos que los parámetros necesarios estén presentes
    if (!venta_id || !producto_id || !cantidad || !precio) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Creamos el detalle de venta
    const detalleVenta = await Detalleventa.create({
      venta_id,
      producto_id,
      cantidad,
      precio,
    });

    return res.status(201).json({
      message: 'Detalle de venta agregado exitosamente',
      detalleVenta,
    });
  } catch (error) {
    console.error('Error al agregar detalle de venta:', error);
    return res.status(500).json({ error: 'Hubo un error al agregar el detalle de venta' });
  }
};

module.exports = {
  agregarDetalleVenta,
  obtenerDetalleVenta
};

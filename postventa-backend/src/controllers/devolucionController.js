const Devolucion = require('../models/devolucion');
const Producto = require('../models/producto');
const Venta = require('../models/venta');
const Categoria = require('../models/categoria');
const Capital = require('../models/capital');

const Inventario = require('../models/inventario');


// Obtener todos los Ventass
const obtenerDevolucion = async (req, res) => {
  try {
    const devoluciones = await Devolucion.findAll({
      include: [
        {
          model: Venta,
          as: 'venta', // El alias para la relación con Venta
        },
        {
          model: Producto,
          as: 'producto', // El alias para la relación con Producto
          include: [
            {
              model: Categoria,  // Asegúrate de tener el modelo 'Categoria' correctamente definido
              as: 'categoria',   // Alias para la relación con Categoria
              attributes: ['nombre'], // Solo obtenemos el nombre de la categoría
            },
          ],
        },
      ],
    });

    return res.status(200).json(devoluciones);
  } catch (error) {
    console.error('Error al obtener Devoluciones:', error);
    return res.status(500).json({ error: 'Error al obtener las devoluciones' });
  }
};





const crearDevolucion = async (req, res) => {
  try {
    const { monto_devolucion, motivo_devolucion, cantidad, venta_id, producto_id } = req.body;

    // Validación de campos requeridos
    if (!monto_devolucion || !motivo_devolucion || !cantidad || !venta_id || !producto_id) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    // Validación para evitar devoluciones con monto negativo o cero
    if (monto_devolucion <= 0) {
      return res.status(400).json({ error: 'El monto de la devolución debe ser mayor a cero.' });
    }

    // Buscar el inventario para ajustar el stock
    const inventario = await Inventario.findOne({ where: { producto_id } });
    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado para el producto.' });
    }

    console.log('Stock actual antes de la devolución:', inventario.cantidad);

    // Ajustar el inventario sumando las unidades devueltas
    inventario.cantidad += cantidad;  // Aumentamos el stock
    await inventario.save();

    console.log('Nuevo stock después de la devolución:', inventario.cantidad);

    // Buscar la venta para ajustar el total de ventas del día
    const venta = await Venta.findByPk(venta_id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    console.log('Total de la venta antes de la devolución:', venta.total);

    // Restar el monto de la devolución del total de ventas del día
    venta.total -= monto_devolucion;
    await venta.save();

    console.log('Nuevo total de ventas después de la devolución:', venta.total);

    // Si se devuelve el dinero al cliente, restar del capital disponible
    if (monto_devolucion) {
      const capital = await Capital.findOne();  // Obtiene el primer registro de capital
      if (!capital) {
        return res.status(404).json({ error: 'Capital no encontrado.' });
      }
      
      console.log('Capital antes de la devolución:', capital.monto);

      capital.monto -= monto_devolucion;  // Ajustar el capital
      await capital.save();  // Guardar el nuevo monto de capital

      console.log('Nuevo capital después de la devolución:', capital.monto);
    }

    // Crear la devolución en la base de datos
    const nuevaDevolucion = await Devolucion.create({
      monto_devolucion,
      motivo_devolucion,
      cantidad,
      venta_id,
      producto_id,
    });

    console.log('Devolución creada:', nuevaDevolucion);

    return res.status(201).json(nuevaDevolucion);
  } catch (error) {
    console.error('Error al crear la devolución:', error);
    return res.status(500).json({ error: 'Error al crear la devolución' });
  }
};



// Editar una devolución
const editarDevolucion = async (req, res) => {
  try {
    const { devolucion_id } = req.params;
    const { monto_devolucion, motivo_devolucion, cantidad } = req.body;

    // Validar que los campos necesarios estén presentes
    if (!monto_devolucion || !motivo_devolucion || !cantidad) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    // Buscar la devolución por ID
    const devolucion = await Devolucion.findByPk(devolucion_id);

    if (!devolucion) {
      return res.status(404).json({ error: 'Devolución no encontrada' });
    }

    // Actualizar los campos
    devolucion.monto_devolucion = monto_devolucion;
    devolucion.motivo_devolucion = motivo_devolucion;
    devolucion.cantidad = cantidad;

    // Guardar la devolución actualizada
    await devolucion.save();

    return res.status(200).json(devolucion);
  } catch (error) {
    console.error('Error al editar la devolución:', error);
    return res.status(500).json({ error: 'Error al editar la devolución' });
  }
};



// Eliminar una devolución
const eliminarDevolucion = async (req, res) => {
  try {
    const { devolucion_id } = req.params;

    // Buscar la devolución por ID
    const devolucion = await Devolucion.findByPk(devolucion_id);

    if (!devolucion) {
      return res.status(404).json({ error: 'Devolución no encontrada' });
    }

    // Eliminar la devolución
    await devolucion.destroy();

    return res.status(200).json({ message: 'Devolución eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la devolución:', error);
    return res.status(500).json({ error: 'Error al eliminar la devolución' });
  }
};




  module.exports = {
    obtenerDevolucion,
    eliminarDevolucion,
    editarDevolucion,
    crearDevolucion

  };
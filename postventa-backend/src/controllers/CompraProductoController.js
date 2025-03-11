const CompraProducto = require('../models/CompraProducto');
const Producto = require('../models/producto');
const Proveedor = require('../models/provedores');

const Inventario = require('../models/inventario');
const Capital = require('../models/capital');



// Crear compra (ya proporcionado en el código original)
const crearCompra = async (req, res) => {
  try {
    const { numero_factura, producto_id, cantidad, precio_compra, id_proveedor } = req.body;

    if (!numero_factura || !producto_id || !cantidad || !precio_compra || !id_proveedor) {
      return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    const total_compra = cantidad * precio_compra;

    // Registrar la compra en la base de datos
    const compra = await CompraProducto.create({
      numero_factura,
      producto_id,
      cantidad,
      precio_compra,
      total_compra,
      id_proveedor,
      fecha_compra: new Date() // Esto almacena la fecha y la hora actual
    });

    console.log('Compra registrada:', compra);

    // 1. Actualizar el inventario
    let inventario = await Inventario.findOne({ where: { producto_id } });

    if (inventario) {
      inventario.cantidad += cantidad; // Aumentar stock
      await inventario.save();
    } else {
      // Si no existe el inventario para el producto, crearlo
      inventario = await Inventario.create({
        producto_id,
        cantidad
      });
    }

    console.log('Inventario actualizado:', inventario);

    // 2. Restar el total de la compra del capital disponible
    const capital = await Capital.findOne(); // Obtener el primer registro de capital
    if (!capital) {
      return res.status(404).json({ error: 'Capital no encontrado.' });
    }

    console.log('Capital antes de la compra:', capital.monto);

    capital.monto -= total_compra; // Reducir el capital
    await capital.save();

    console.log('Nuevo capital después de la compra:', capital.monto);

    return res.status(201).json({ compra, inventario, capital });
  } catch (error) {
    console.error('Error al crear la compra:', error);
    return res.status(500).json({ error: 'Hubo un error al registrar la compra' });
  }
};


// Obtener todas las compras
const obtenerCompra = async (req, res) => {
  try {
    const CompraProductos = await CompraProducto.findAll({
      include: [
        {
          model: Producto,
          as: 'producto',
        },
        {
          model: Proveedor,
          as: 'proveedor',
        },
      ],
    });

    return res.status(200).json(CompraProductos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Editar compra
const editarCompra = async (req, res) => {
  try {
    const { id_compras_productos } = req.params;
    const { producto_id, cantidad, precio_compra, id_proveedor } = req.body;

    // Buscar la compra actual para obtener el nombre del producto
    const compra = await CompraProducto.findByPk(id_compras_productos);

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    // Obtener el producto relacionado
    const producto = await Producto.findByPk(compra.producto_id);

    // Actualizar la compra
    const total_compra = cantidad * precio_compra;
    const compraActualizada = await compra.update({
      producto_id,
      cantidad,
      precio_compra,
      total_compra,
      id_proveedor,
    });

    // Devolver la respuesta con el nombre del producto
    return res.status(200).json({
      message: `Compra de ${producto.nombre} actualizada correctamente.`,
      compra: compraActualizada,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Hubo un error al actualizar la compra' });
  }
};


// Eliminar compra
const eliminarCompra = async (req, res) => {
  try {
    const { id_compras_productos } = req.params;

    // Buscar la compra a eliminar
    const compra = await CompraProducto.findByPk(id_compras_productos);

    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }

    // Obtener el producto relacionado
    const producto = await Producto.findByPk(compra.producto_id);

    // Eliminar la compra
    await compra.destroy();

    // Devolver la respuesta con el nombre del producto
    return res.status(200).json({
      message: `Compra de ${producto.nombre} eliminada correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Hubo un error al eliminar la compra' });
  }
};


module.exports = { crearCompra, obtenerCompra, editarCompra, eliminarCompra };

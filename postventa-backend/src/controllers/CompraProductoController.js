const CompraProducto = require('../models/CompraProducto');
const Producto = require('../models/producto');
const Proveedor = require('../models/provedores');

const Inventario = require('../models/inventario');
const Capital = require('../models/capital');



// Crear compra (ya proporcionado en el código original)
const crearCompra = async (req, res) => {
  try {
    const { numero_factura, producto_id, cantidad, precio_compra, id_proveedor } = req.body;

    console.log("Datos recibidos en la compra:", req.body);

    if (!numero_factura || !producto_id || !cantidad || !precio_compra || !id_proveedor) {
      console.warn("Error: Faltan campos requeridos.");
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const total_compra = cantidad * precio_compra;
    console.log(`Total de la compra calculado: ${total_compra}`);

    // Registrar la compra en la base de datos
    const compra = await CompraProducto.create({
      numero_factura,
      producto_id,
      cantidad,
      precio_compra,
      total_compra,
      id_proveedor,
      fecha_compra: new Date(), // Esto almacena la fecha y la hora actual
    });

    console.log("Compra registrada en la base de datos:", compra);

    
    // 1. Buscar el inventario del producto
let inventario = await Inventario.findOne({ where: { producto_id } });

if (inventario) {
  console.log("Inventario encontrado antes de actualizar:", inventario);

  // Asegúrate de que cantidad es un número válido
  const cantidadSumar = parseInt(cantidad, 10);

  // Verificar que cantidadSumar sea un número válido
  if (!isNaN(cantidadSumar)) {
    // Sumar la cantidad actual con la nueva cantidad
    inventario.cantidad = inventario.cantidad + cantidadSumar;

    // Guardar el inventario con la nueva cantidad
    await inventario.save();

    console.log("Inventario actualizado:", inventario);
  } else {
    console.error("La cantidad a sumar no es válida:", cantidad);
  }
} else {
  console.log("Inventario NO encontrado. Se creará un nuevo registro.");

  // Crear el inventario si no existe
  inventario = await Inventario.create({
    producto_id,
    cantidad: parseInt(cantidad, 10), // Asegúrate de que 'cantidad' también sea un número
    tipo_movimiento: "compra", // Agregar tipo de movimiento
    fecha_movimiento: new Date(),
    precio_unitario: precio_compra, // Usar precio de compra como precio unitario
    motivo_movimiento: "Ingreso por compra",
  });

  console.log("Nuevo inventario creado:", inventario);
}


// 2. Restar el total de la compra del capital disponible
const capital = await Capital.findOne(); // Obtener el primer registro de capital
if (!capital) {
  console.error("Error: Capital no encontrado.");
  return res.status(404).json({ error: "Capital no encontrado." });
}

console.log("Capital antes de la compra:", capital.monto);

capital.monto -= total_compra; // Reducir el capital
await capital.save();

console.log("Nuevo capital después de la compra:", capital.monto);

return res.status(201).json({ compra, inventario, capital });
  } catch (error) {
  console.error("Error al crear la compra:", error);
  return res.status(500).json({ error: "Hubo un error al registrar la compra" });
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

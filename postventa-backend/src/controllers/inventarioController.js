const Inventario = require('../models/inventario'); // Asegúrate de que el modelo 'Inventario' esté correctamente importado
const Producto = require('../models/producto'); // Asegúrate de que el modelo Producto esté importado correctamente
const Empleado = require('../models/empleado'); // Asegúrate de que el modelo Producto esté importado correctamente



// Obtener todos los inventarios
const obtenerInventarios = async (req, res) => {
  try {
    const inventarios = await Inventario.findAll({
      include: [
        {
          model: Producto,
          as: "producto",
          required: false, // Permitir que los registros sin relación sean devueltos
        },
        {
          model: Empleado,
          as: "empleado",
          required: false, // Permitir que los registros sin relación sean devueltos
        },
      ],
      raw: true, // Obtener los datos sin formato de Sequelize
      nest: true, // Asegurar que las relaciones se estructuren bien
    });

    console.log("Inventarios obtenidos:", inventarios);
    res.json(inventarios);
  } catch (error) {
    console.error("Error al obtener inventarios:", error);
    res.status(500).json({ error: "Error al obtener inventarios" });
  }
};



// Obtener un inventario por ID
const obtenerInventarioPorId = async (req, res) => {
  try {
    // Buscar el inventario por su ID, incluyendo los datos del empleado y producto
    const inventario = await Inventario.findByPk(req.params.id_inventarios, {
      include: [
        {
          model: Empleado, // Incluir la información del empleado
          as: 'empleado',  // Usar el alias correcto
          required: true // Esto hace que se realice un INNER JOIN
        },
        {
          model: Producto, // Incluir la información del producto
          as: 'producto',  // Usar el alias correcto
          required: true // Esto hace que se realice un INNER JOIN
        }
      ]
    });

    // Verificar si se encontró el inventario
    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    // Devolver el inventario con los datos del empleado y producto
    return res.status(200).json(inventario);
  } catch (error) {
    console.error('Error al obtener el inventario:', error);
    return res.status(500).json({ error: 'Error al obtener el inventario' });
  }
};


// Agregar un inventario
const agregarInventario = async (req, res) => {
  try {
    // Desestructuración de todos los campos del cuerpo de la solicitud
    const {
      producto_id,
      cantidad,
      tipo_movimiento,
      precio_unitario,
      empleado_id,
      fecha_movimiento,
      ubicacion,
      estado_producto,
      motivo_movimiento,
      cantidad_actual,
      referencia_externa,
      comentario
    } = req.body;

    // Validación de campos obligatorios
    if (!producto_id) {
      return res.status(400).json({ error: 'El campo "producto_id" es obligatorio' });
    }
    if (!cantidad) {
      return res.status(400).json({ error: 'El campo "cantidad" es obligatorio' });
    }
    if (!tipo_movimiento) {
      return res.status(400).json({ error: 'El campo "tipo_movimiento" es obligatorio' });
    }
    if (!precio_unitario) {
      return res.status(400).json({ error: 'El campo "precio_unitario" es obligatorio' });
    }
    if (!empleado_id) {
      return res.status(400).json({ error: 'El campo "empleado_id" es obligatorio' });
    }

    // Validar que 'cantidad' y 'precio_unitario' sean números válidos
    // if (isNaN(cantidad) || cantidad <= 0) {
    //   return res.status(400).json({ error: 'La cantidad debe ser un número mayor que cero' });
    // }

    if (isNaN(precio_unitario) || precio_unitario <= 0) {
      return res.status(400).json({ error: 'El precio unitario debe ser un número mayor que cero' });
    }

    // Validar que 'cantidad_actual' no sea null y sea un número válido
    // if (cantidad_actual === null || cantidad_actual === undefined || isNaN(cantidad_actual) || cantidad_actual < 0) {
    //   return res.status(400).json({ error: 'La cantidad actual debe ser un número válido y mayor o igual a cero' });
    // }

    // Validar que 'fecha_movimiento' sea una fecha válida si se proporciona
    if (fecha_movimiento && isNaN(new Date(fecha_movimiento).getTime())) {
      return res.status(400).json({ error: 'La fecha de movimiento no es válida' });
    }

    // Validar que 'ubicacion' no sea vacío si se proporciona
    if (ubicacion && typeof ubicacion !== 'string') {
      return res.status(400).json({ error: 'La ubicación debe ser una cadena de texto válida' });
    }

    // Crear el nuevo inventario en la base de datos
    const nuevoInventario = await Inventario.create({
      producto_id,
      cantidad,
      tipo_movimiento,
      precio_unitario,
      empleado_id,
      cantidad_actual,
      fecha_movimiento: fecha_movimiento ? new Date(fecha_movimiento) : new Date(),
      ubicacion,
      estado_producto,
      motivo_movimiento,
      referencia_externa,
      comentario
    });

    // Enviar la respuesta con el nuevo inventario creado
    return res.status(201).json({
      message: `Inventario con Producto ID ${producto_id} agregado exitosamente.`,
      nuevoInventario
    });

  } catch (error) {
    console.error('Error al agregar el inventario:', error);
    return res.status(500).json({ error: 'Error al agregar el inventario' });
  }
};


// Actualizar inventario por ID
const actualizarInventarioPorId = async (req, res) => {
  try {
    const { id_inventarios } = req.params;
    const {
      producto_id,
      empleado_id,
      cantidad,
      tipo_movimiento,
      precio_unitario,
      fecha_movimiento,
      ubicacion,
      estado_producto,
      motivo_movimiento,
      cantidad_actual,
      referencia_externa,
      comentario
    } = req.body;

    const inventario = await Inventario.findByPk(id_inventarios);

    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    // Actualiza los campos del inventario
    await inventario.update({
      producto_id,
      empleado_id,
      cantidad,
      tipo_movimiento,
      precio_unitario,
      fecha_movimiento,
      ubicacion,
      estado_producto,
      motivo_movimiento,
      cantidad_actual,
      referencia_externa,
      comentario
    });

    return res.status(200).json({
      message: `Inventario con ID ${id_inventarios} actualizado correctamente.`,
      inventario
    });
  } catch (error) {
    console.error('Error al actualizar el inventario:', error);
    return res.status(500).json({ error: 'Error al actualizar el inventario' });
  }
};

// Eliminar un inventario por ID
const eliminarInventarioPorId = async (req, res) => {
  try {
    const { id_inventarios } = req.params;
    const inventario = await Inventario.findByPk(id_inventarios);

    if (!inventario) {
      return res.status(404).json({ error: 'Inventario no encontrado' });
    }

    await inventario.destroy();
    return res.status(200).json({
      message: `Inventario con ID ${id_inventarios} eliminado correctamente.`
    });
  } catch (error) {
    console.error('Error al eliminar el inventario:', error);
    return res.status(500).json({ error: 'Error al eliminar el inventario' });
  }
};

// Eliminar todos los inventarios
const eliminarInventarios = async (req, res) => {
  try {
    await Inventario.destroy({ where: {} }); // Elimina todos los registros
    return res.status(200).json({ message: 'Todos los inventarios eliminados exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar los inventarios:', error);
    return res.status(500).json({ error: 'Error al eliminar los inventarios' });
  }
};



const STOCK_MINIMO = 5; // Define el límite de stock bajo

const verificarStockBajo = async (req, res) => {
  const producto_id = req.params.producto_id; // Extraer producto_id de los parámetros de la URL

  console.log(`Producto ID recibido: ${producto_id}`); // Para verificar que el parámetro está llegando correctamente

  try {
    // Asegúrate de que producto_id sea un número válido
    const productoIdInt = parseInt(producto_id, 10);
    if (isNaN(productoIdInt)) {
      return res.status(400).json({ error: 'El ID del producto no es válido.' });
    }

    console.log(`Producto ID convertido a número: ${productoIdInt}`); // Verificar conversión a número

    const inventario = await Inventario.findOne({
      where: { producto_id: productoIdInt },
      include: {
        model: Producto,
        as: 'producto', // Alias utilizado en la relación
        attributes: ['nombre'], // Solo selecciona el nombre del producto
      },
    });

    // Comprobar si se encontró el inventario
    console.log(`Inventario encontrado: ${JSON.stringify(inventario)}`);

    if (inventario) {
      console.log(`Cantidad actual del producto: ${inventario.cantidad}`); // Verificar cantidad

      if (inventario.cantidad <= STOCK_MINIMO) {
        console.log(`⚠️ Alerta: El stock del producto ID ${productoIdInt} está bajo tiene una cantidad de: (${inventario.cantidad})`);

        return res.status(200).json({
          message: `El stock del producto ${inventario.producto.nombre} (ID ${productoIdInt}) está bajo (${inventario.cantidad})`,
        });
      } else {
        return res.status(200).json({
          message: `El stock del producto ${inventario.producto.nombre} (ID ${productoIdInt}) es suficiente (${inventario.cantidad})`,
        });
      }
    } else {
      return res.status(404).json({ error: `Producto con ID ${productoIdInt} no encontrado.` });
    }
  } catch (error) {
    console.error('Error verificando stock bajo:', error);
    return res.status(500).json({ error: 'Error en el servidor al verificar el stock.' });
  }
};




// router.get('/inventariosstock/:producto_id', verificarStockBajo); // Ruta con parámetro de producto_id



// module.exports = { verificarStockBajo };



module.exports = {
  obtenerInventarios,
  obtenerInventarioPorId,
  agregarInventario,
  actualizarInventarioPorId,
  eliminarInventarioPorId,
  eliminarInventarios,
  verificarStockBajo
  
};

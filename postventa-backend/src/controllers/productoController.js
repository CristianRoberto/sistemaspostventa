const Producto = require('../models/producto');

const Categoria = require('../models/categoria');
const obtenerProductos = async (req, res) => {
  try {
    // Usar el modelo de Producto con relaciones
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria', // El alias para los detalles de la venta
        },
      ],
    });

    // Devuelve los productos encontrados
    return res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
};


// Agregar un nuevo producto
const agregarProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria_id } = req.body;
  const imagenproducto = req.file ? req.file.filename : null; // Obtener el nombre de la imagen

  console.log('Imagen procesada:', req.file); // Verificar si la imagen se ha recibido correctamente

  // Verificar si todos los campos necesarios están presentes
  if (!nombre || !precio || !categoria_id || !imagenproducto) {
    return res.status(400).json({ error: 'Todos los campos son requeridos, incluyendo la imagen' });
  }

  try {
    // Crear un nuevo producto
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      categoria_id,
      imagenproducto
    });

    console.log('Nuevo Producto:', nuevoProducto); // Depurar el producto creado

    // Verificar que la imagen se haya guardado correctamente
    if (!nuevoProducto || !nuevoProducto.imagenproducto) {
      return res.status(500).json({ error: 'Imagen no cargada correctamente o producto no creado' });
    }

    // Crear la URL para la imagen después de crear el producto
    const imageUrl = `http://localhost:5000/uploads/${nuevoProducto.imagenproducto}`;

    return res.status(201).json({
      mensaje: 'Producto agregado con éxito',
      producto: { 
        ...nuevoProducto.toJSON(),  // Convierte el producto a un objeto JSON
        imagenUrl: imageUrl        // Asegúrate de que imageUrl esté disponible aquí
      }
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    return res.status(500).json({ error: 'Error al agregar el producto', detalles: error.message });
  }
};










// Obtener un producto por su id
const obtenerProductoPorId = async (req, res) => {
  const { producto_id } = req.params;  // Captura el id de la URL
  console.log(`Buscando producto con id: ${producto_id}`);  // Muestra el id que se está buscando en consola

  try {
    // Busca el producto por su id
    const producto = await Producto.findOne({
      where: { producto_id: producto_id }  // Filtro por el id del producto
    });

    // Muestra el resultado de la búsqueda
    console.log('Producto encontrado:', producto);

    if (!producto) {
      // Si no se encuentra el producto, devuelve un error 404
      // console.log(`Producto con id ${producto_id} no encontrado`);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si el producto es encontrado, se devuelve el producto
    return res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

const actualizarProductoPorId = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const { nombre, descripcion, precio } = req.body; // Adapta a tus campos
    console.log('Intentando actualizar producto con ID:', producto_id);
    // Busca el producto por su ID
    const producto = await Producto.findByPk(producto_id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    // Actualiza los campos del producto
    await producto.update({
      nombre,
      descripcion,
      precio,
    });
    console.log('Producto actualizado correctamente con ID:', producto_id);
    return res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    console.error('Detalles del error:', error.stack);
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const eliminarProductoPorId = async (req, res) => {
  try {
    const { producto_id } = req.params;
    console.log('Intentando eliminar producto con ID:', producto_id);
    // Elimina el producto por su ID
    const productoEliminado = await Producto.destroy({
      where: { producto_id }
    });
    console.log('Producto eliminado:', productoEliminado);
    if (productoEliminado === 0) {
      console.log('Producto no encontrado con ID:', producto_id);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log('Producto eliminado correctamente con ID:', producto_id);
    return res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    console.error('Detalles del error:', error.stack); // Muestra la pila de llamadas completa
    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// eliminar todos los productos VALIDO SOLO PARA EL ADMINISTRADOR
const eliminarProductos = async (req, res) => {
  try {
    const productos =     await Producto.destroy({ truncate: { cascade: true } });// Elimina todos los productos de la tabla
    // console.error('resultado obtenidos es ', productos);
    return res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

module.exports = {  agregarProducto, obtenerProductos, 
  obtenerProductoPorId, eliminarProductoPorId, eliminarProductos,
  actualizarProductoPorId 
};

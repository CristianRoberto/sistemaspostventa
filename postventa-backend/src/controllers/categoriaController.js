const Categoria = require('../models/categoria');

const defectoCategorias = async (req, res) => {
    res.send('Este es el metodo get por defecto!');
};

// Agregar un nuevo Categoria
const agregarCategoria = async (req, res) => {
  const { nombre, descripcion  } = req.body;
  // Validación básica
  if (!nombre || !descripcion ) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  try {
    // Crear un nuevo Categoria
    const nuevoCategoria = await Categoria.create({
      nombre,
      descripcion
    });

    return res.status(201).json({ mensaje: 'Categoria agregado con éxito', Categoria: nuevoCategoria });
  } catch (error) {
    console.error('Error al agregar Categoria:', error);
    return res.status(500).json({ error: 'Error al agregar el Categoria' });
  }
};

// Obtener todos los Categorias
const obtenerCategorias = async (req, res) => {
  try {
    const Categorias = await Categoria.findAll();
    // console.error('resultado obtenidos es ', Categorias);
    return res.status(200).json(Categorias);
  } catch (error) {
    console.error('Error al obtener Categorias:', error);
    return res.status(500).json({ error: 'Error al obtener los Categorias' });
  }
};

// Obtener un Categoria por su id
const obtenerCategoriaPorId = async (req, res) => {
    try {
      const categoria_id = req.params.categoria_id;
      console.log(`Buscando Categoria con id: ${categoria_id}`);
      const categoria = await Categoria.findOne({
        where: { categoria_id: categoria_id }, // Usa el nombre correcto de la columna
      });
  
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
      res.json(categoria);
    } catch (error) {
      console.error('Error al obtener el Categoria:', error);
      res.status(500).json({ mensaje: 'Error al obtener la categoría' });
    }
  };
    
const actualizarCategoriaPorId = async (req, res) => {
    try {
        // Captura el ID desde los parámetros de la URL
        const categoriaId = req.params.categoria_id;
        if (!categoriaId) {
            return res.status(400).json({
                mensaje: 'El ID de la categoría es requerido.',
            });
        }
        // Captura el resto de los datos desde el cuerpo de la solicitud
        const { nombre, descripcion } = req.body;
        // Verifica si el ID es válido antes de intentar actualizar
        const [actualizado] = await Categoria.update(
            { nombre, descripcion },
            { where: { categoria_id: categoriaId } } // Usar el ID para encontrar y actualizar
        );
        if (!actualizado) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada.',
            });
        }
        // Respuesta exitosa
        res.json({
            mensaje: 'Categoría actualizada exitosamente.',
        });
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar la categoría',
            detalles: error.message,
        });
    }
};

const eliminarCategoriaPorId = async (req, res) => {
  try {
    const { categoria_id } = req.params;
    console.log('Intentando eliminar Categoria con ID:', categoria_id);
    // Elimina el Categoria por su ID
    const CategoriaEliminado = await Categoria.destroy({
      where: { categoria_id }
    });
    console.log('Categoria eliminado:', CategoriaEliminado);
    if (CategoriaEliminado === 0) {
      console.log('Categoria no encontrado con ID:', categoria_id);
      return res.status(404).json({ error: 'Categoria no encontrado' });
    }
    console.log('Categoria eliminado correctamente con ID:', categoria_id);
    return res.status(200).json({ message: 'Categoria eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el Categoria:', error);
    console.error('Detalles del error:', error.stack); // Muestra la pila de llamadas completa
    return res.status(500).json({ error: 'Error al eliminar el Categoria' });
  }
};

// eliminar todos las Categorias VALIDO SOLO PARA EL ADMINISTRADOR
const eliminarCategorias = async (req, res) => {
  try {
    const Categorias = await Categoria.destroy({ truncate: { cascade: true } });// Elimina todos los Categorias de la tabla
    // console.error('resultado obtenidos es ', Categorias);
    return res.status(200).json(Categorias);
  } catch (error) {
    console.error('Error al obtener Categorias:', error);
    return res.status(500).json({ error: 'Error al borrar las Categorias' });
  }
};

module.exports = { defectoCategorias, agregarCategoria, obtenerCategorias, 
  obtenerCategoriaPorId, eliminarCategoriaPorId, eliminarCategorias,
  actualizarCategoriaPorId 
};

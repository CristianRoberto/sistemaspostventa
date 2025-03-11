const Capital = require('../models/capital'); // Importa el modelo Capital

// Crear o actualizar capital
const crearOActualizarCapital = async (req, res) => {
  try {
    const { monto } = req.body; // El monto que se pasará en el cuerpo de la solicitud

    // Si no se pasa monto, se devuelve un error
    if (!monto) {
      return res.status(400).json({ error: 'El monto es requerido.' });
    }

    // Verificamos si ya existe un registro de capital
    let capital = await Capital.findOne({ where: {} }); // Usamos un filtro vacío para buscar el primer registro

    if (capital) {
      // Si ya existe, actualizamos el monto
      capital.monto = monto;
      capital.updatedAt = new Date(); // Actualizamos el campo updatedAt manualmente

      await capital.save();
      return res.status(200).json({ message: 'Capital actualizado correctamente.', capital });
    } else {
      // Si no existe, creamos uno nuevo
      capital = await Capital.create({
        monto,
      });
      return res.status(201).json({ message: 'Capital creado correctamente.', capital });
    }
  } catch (error) {
    console.error('Error al crear o actualizar el capital:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
};

module.exports = { crearOActualizarCapital };

const Empleado = require('../models/empleado');


// Obtener todos los Ventass
const obtenerEmpleado = async (req, res) => {
    try {
      const Empleados = await Empleado.findAll();
      // console.error('resultado obtenidos es ', Ventass);
      return res.status(200).json(Empleados);
    } catch (error) {
      console.error('Error al obtener Empleado:', error);
      return res.status(500).json({ error: 'Error al obtener los Empleado' });
    }
  };


 
  const validarCampo = (campo, regex, mensaje) => {
    if (!regex.test(campo)) {
      return mensaje;
    }
    return null;
  };
  
  const agregarEmpleado = async (req, res) => {
    // Ruta para agregar un empleado
    const { cedula, nombre, apellidos, direccion, email, telefono, puesto, salario } = req.body;
  
    console.log("Datos recibidos en el body:", req.body);
  
    // Validación básica (campo obligatorio)
    if (!cedula || !nombre || !puesto) {
      return res.status(400).json({ error: "Cédula, nombre y puesto son requeridos" });
    }
  
    // Validaciones utilizando la función auxiliar 'validarCampo'
    const validaciones = [
      { campo: cedula, regex: /^\d{10}$/, mensaje: "La cédula debe tener 10 dígitos numéricos" },
      { campo: nombre, regex: /^[a-zA-Z\s]+$/, mensaje: "El nombre debe contener solo letras y tener al menos 3 caracteres", minimo: 3 },
      { campo: direccion, regex: /.*/, mensaje: "La dirección debe tener al menos 5 caracteres", minimo: 5 },
      { campo: email, regex: /\S+@\S+\.\S+/, mensaje: "El correo electrónico no es válido" },
      { campo: telefono, regex: /^\d{10}$/, mensaje: "El teléfono debe tener 10 dígitos numéricos" },
      { campo: puesto, regex: /.*/, mensaje: "El puesto no puede estar vacío" },
      { campo: salario, regex: /^[+]?\d*\.?\d+$/, mensaje: "El salario debe ser un número positivo" },
    ];
  
    // Realizar las validaciones
    for (const { campo, regex, mensaje, minimo } of validaciones) {
      if (campo) {
        if (minimo && campo.length < minimo) {
          return res.status(400).json({ error: `${mensaje} (mínimo ${minimo} caracteres)` });
        }
        const error = validarCampo(campo, regex, mensaje);
        if (error) {
          return res.status(400).json({ error });
        }
      }
    }
  
    try {
      // Verificar si la cédula, correo electrónico o teléfono ya están registrados
      const camposExistentes = [
        { campo: "cedula", valor: cedula },
        { campo: "email", valor: email },
        { campo: "telefono", valor: telefono },
      ];
  
      for (const { campo, valor } of camposExistentes) {
        const existe = await Empleado.findOne({ where: { [campo]: valor } });
        if (existe) {
          return res.status(400).json({ error: `${campo.charAt(0).toUpperCase() + campo.slice(1)} ya está registrado` });
        }
      }
  
      // Crear un nuevo empleado
      const nuevoEmpleado = await Empleado.create({
        cedula,
        nombre,
        apellidos,
        direccion,
        email,
        telefono,
        puesto,
        salario,
      });
  
      return res.status(201).json({
        mensaje: "Empleado agregado con éxito",
        empleado: nuevoEmpleado,
      });
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      return res.status(500).json({ error: "Error al agregar el empleado" });
    }
  };
  
  


  const eliminarEmpleadoId = async (req, res) => {
    try {
      const { empleado_id } = req.params;
      console.log('Intentando E empleado con ID:', empleado_id);
      // Elimina el empleado por su ID
      const empleadoEliminado = await Empleado.destroy({
        where: { empleado_id }
      });
      console.log('empleado eliminado:', empleadoEliminado);
      if (empleadoEliminado === 0) {
        console.log('empleado no encontrado con ID:', empleado_id);
        return res.status(404).json({ error: 'empleado no encontrado' });
      }
      console.log('empleado eliminado correctamente con ID:', empleado_id);
      return res.status(200).json({ message: 'empleado eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      console.error('Detalles del error:', error.stack); // Muestra la pila de llamadas completa
      return res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
  };


const actualizarempleadoPorId = async (req, res) => {
    try {
        // Captura el ID desde los parámetros de la URL
        const empleadoId = req.params.empleado_id;
        if (!empleadoId) {
            return res.status(400).json({
                mensaje: 'El ID de la Empleado es requerido.',
            });
        }
        // Captura el resto de los datos desde el cuerpo de la solicitud
        const { nombre, descripcion } = req.body;
        // Verifica si el ID es válido antes de intentar actualizar
        const [actualizado] = await Empleado.update(
            { nombre, descripcion },
            { where: { empleado_id: empleadoId } } // Usar el ID para encontrar y actualizar
        );
        if (!actualizado) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrada.',
            });
        }
        // Respuesta exitosa
        res.json({
            mensaje: 'Empleado actualizada exitosamente.',
        });
    } catch (error) {
        console.error('Error al actualizar Empleado:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar Empleado',
            detalles: error.message,
        });
    }
};

const obtenerEmpleadoPorCedula = async (req, res) => {
  try {
      const { cedula } = req.params; // Capturar la cédula de los parámetros de la URL
      const empleado = await Empleado.findOne({ where: { cedula } });

      if (!empleado) {
          return res.status(404).json({ error: "Empleado no encontrado" });
      }

      return res.status(200).json(empleado);
  } catch (error) {
      console.error("Error al buscar empleado por cédula:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
  }
};


  
module.exports = {
    obtenerEmpleado,  agregarEmpleado, eliminarEmpleadoId, actualizarempleadoPorId,
    obtenerEmpleadoPorCedula
  };
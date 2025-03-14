const Cliente = require('../models/cliente');


const TransaccionPuntos = require('../models/TransaccionPuntos');


const { Op } = require('sequelize');

const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);
dayjs.extend(timezone);


// Obtener todos los Clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    if (!clientes.length) {
      return res.status(404).json({ mensaje: 'No hay clientes registrados.' });
    }
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener Clientes:', error);
    return res.status(500).json({ error: 'Error al obtener los clientes', detalles: error.message });
  }
};



// Agregar un Cliente
const agregarCliente = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      estado,
      tipo_cliente,
      ruc_cedula,
      metodo_contacto_preferido,
      ultima_compra,
      total_compras,
      observaciones,
      nivel_satisfaccion,
      cantidad_reclamos
    } = req.body;

    // Agregar console log para verificar que los datos están llegando correctamente
    console.log("Datos recibidos:", req.body);

    // Validación de campos requeridos
    if (!nombre || !apellidos || !email || !telefono || !direccion || !estado || !tipo_cliente || !ruc_cedula) {
      console.log("Error de validación: Campos faltantes");
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Error de validación: Formato de email inválido");
      return res.status(400).json({ error: 'El formato del email es inválido' });
    }

    // Validar si el correo electrónico ya está registrado
    const emailExistente = await Cliente.findOne({ where: { email } });
    if (emailExistente) {
      console.log("Error de validación: El correo electrónico ya está registrado");
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Validar número de teléfono (ejemplo: solo números)
    if (!/^\d+$/.test(telefono)) {
      console.log("Error de validación: Teléfono no válido");
      return res.status(400).json({ error: 'El teléfono solo debe contener números' });
    }

    // Validar unicidad de ruc_cedula
    const clienteExistente = await Cliente.findOne({ where: { ruc_cedula } });
    if (clienteExistente) {
      console.log("Error: RUC/Cédula ya registrado");
      return res.status(400).json({ error: 'El RUC/Cédula ya está registrado' });
    }
    // Asignar valor predeterminado para metodo_contacto_preferido si está vacío
    const metodoContacto = metodo_contacto_preferido || 'email'; // Puedes usar otro valor si lo prefieres


    // Asignar valores por defecto o transformar datos antes de crear el cliente
    const clienteData = {
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      estado,
      tipo_cliente,
      ruc_cedula,
      metodo_contacto_preferido: metodoContacto,  // Usamos el valor predeterminado si está vacío
      ultima_compra: ultima_compra ? dayjs(ultima_compra).tz("America/Guayaquil").toDate() : dayjs().tz("America/Guayaquil").toDate(), // Usar fecha actual si está vacío
      total_compras: total_compras || 0.00,  // Usar 0.00 si está vacío
      observaciones: observaciones || '',  // Usar string vacío si está vacío
      nivel_satisfaccion: nivel_satisfaccion || 3,  // Asignar valor predeterminado (ej. 3)
      cantidad_reclamos: cantidad_reclamos || 0,  // Usar 0 si está vacío
    };

    // Agregar log antes de crear el cliente
    console.log("Creando nuevo cliente con los siguientes datos:", clienteData);

    // Crear Cliente
    const nuevoCliente = await Cliente.create(clienteData);

    // Log después de crear el cliente
    console.log("Cliente creado con éxito:", nuevoCliente);

    return res.status(201).json({ mensaje: 'Cliente agregado con éxito', cliente: nuevoCliente });
  } catch (error) {
    // Log del error
    console.error('Error al agregar Cliente:', error);
    return res.status(500).json({ error: 'Error al agregar el Cliente', detalles: error.message });
  }
};


// Obtener un Cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    const { cliente_id } = req.params;
    if (!cliente_id) {
      return res.status(400).json({ error: 'El ID del cliente es requerido' });
    }

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener el Cliente:', error);
    return res.status(500).json({ mensaje: 'Error al obtener el Cliente', detalles: error.message });
  }
};

// Actualizar un Cliente por ID
const actualizarClientePorId = async (req, res) => {
  try {
    const { cliente_id } = req.params;
    if (!cliente_id) {
      return res.status(400).json({ error: 'El ID del Cliente es requerido.' });
    }

    const clienteExistente = await Cliente.findByPk(cliente_id);
    if (!clienteExistente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const {
      nombre,
      apellidos,
      email,
      telefono,
      direccion,
      estado,
      tipo_cliente,
      ruc_cedula,
      metodo_contacto_preferido,
      ultima_compra,
      total_compras,
      observaciones,
      nivel_satisfaccion,
      cantidad_reclamos,
      total_puntos_acumulados
    } = req.body;

    // Validar formato de email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'El formato del email es inválido' });
    }

    // Validar teléfono
    if (telefono && !/^\d+$/.test(telefono)) {
      return res.status(400).json({ error: 'El teléfono solo debe contener números' });
    }

    // Validar que el RUC/Cédula no se duplique
    if (ruc_cedula) {
      const existeOtroCliente = await Cliente.findOne({ where: { ruc_cedula, cliente_id: { [Op.ne]: cliente_id } } });
      if (existeOtroCliente) {
        return res.status(400).json({ error: 'El RUC/Cédula ya está registrado con otro cliente' });
      }
    }

    // Si nivel_satisfaccion o cantidad_reclamos están vacíos, asignarles un valor por defecto
    const updatedData = {
      nombre,
      apellidos,  // Asegúrate de incluir este campo si es necesario
      email,
      telefono,
      direccion,
      estado,
      tipo_cliente,
      ruc_cedula,
      metodo_contacto_preferido,
      ultima_compra,
      total_compras,
      observaciones,
      nivel_satisfaccion: nivel_satisfaccion || 0,
      cantidad_reclamos: cantidad_reclamos || 0,
      total_puntos_acumulados  // Incluye este campo si lo necesitas
    };


    // Actualizar Cliente
    await clienteExistente.update(updatedData);
    console.log("Cliente actualizado:", clienteExistente);


    return res.status(200).json({ mensaje: 'Cliente actualizado exitosamente', cliente: clienteExistente });
  } catch (error) {
    console.error('Error al actualizar el Cliente:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar el Cliente', detalles: error.message });
  }
};





// Eliminar un Cliente por ID
const eliminarClientePorId = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    // Validar si el cliente_id está presente en los parámetros
    if (!cliente_id) {
      return res.status(400).json({ error: 'El ID del Cliente es requerido' });
    }

    // Buscar el cliente en la base de datos
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el cliente tiene registros dependientes (por ejemplo, transacciones de puntos)
    const transacciones = await TransaccionPuntos.findAll({
      where: { cliente_id },
    });

    if (transacciones.length > 0) {
      return res.status(400).json({
        error: 'El cliente tiene transacciones de puntos asociadas. No se puede eliminar.',
      });
    }

    // Realizar la eliminación del cliente
    await cliente.destroy();

    return res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar el Cliente:', error);

    // Capturar error por violación de clave foránea
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "No se puede eliminar el cliente debido a una restricción de clave foránea.",
      });
    }

    // Capturar error si no se encuentra la transacción o hay un error con la consulta
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        error: 'Error de base de datos al eliminar el cliente. Verifique las dependencias.',
        detalles: error.message,
      });
    }

    // Capturar errores generales y enviar un mensaje genérico
    return res.status(500).json({
      error: 'Error inesperado al eliminar el Cliente',
      detalles: error.message
    });
  }
};
















// Eliminar todos los Clientes (solo Admin)
const eliminarClientes = async (req, res) => {
  try {
    const clientesEliminados = await Cliente.destroy({ where: {}, truncate: true });
    return res.status(200).json({ mensaje: `Se eliminaron ${clientesEliminados} clientes` });
  } catch (error) {
    console.error('Error al eliminar los Clientes:', error);
    return res.status(500).json({ error: 'Error al borrar los Clientes', detalles: error.message });
  }
};

module.exports = {
  agregarCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarClientePorId,
  eliminarClientePorId,
  eliminarClientes
};

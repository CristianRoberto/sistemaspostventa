const Proveedor = require('../models/provedores');  // Asegúrate de tener el modelo importado


// Obtener todos los Ventass
const obtenerProvedor = async (req, res) => {
  try {
    const verProveedor = await Proveedor.findAll();
    // console.error('resultado obtenidos es ', Ventass);
    return res.status(200).json(verProveedor);
  } catch (error) {
    console.error('Error al obtener Ventas:', error);
    return res.status(500).json({ error: 'Error al obtener los Ventas' });
  }
};


// Agregar un nuevo Provedor
const agregarProvedor = async (req, res) => {
  // Desestructurar los campos que se esperan en el cuerpo de la solicitud
  const {
    nombre,
    tipo_proveedor,
    ruc_cif,
    telefono,
    correo_electronico,
    direccion_fisica,
    persona_contacto,
    telefono_contacto,
    plazo_pago,
    metodo_pago,
    moneda,
    descuento_volumen,
    condiciones_entrega,
    fecha_ultimo_pedido,
    monto_total_compras,
    estado,
    calificacion,
    historico_devoluciones
  } = req.body;

  // Validación básica de campos obligatorios
  if (!nombre || !ruc_cif) {
    return res.status(400).json({ error: 'Los campos "nombre" y "ruc_cif" son requeridos' });
  }

  // Validar si el RUC ya existe en la base de datos
  const proveedorExistente = await Proveedor.findOne({ where: { ruc_cif } });
  if (proveedorExistente) {
    return res.status(400).json({ error: 'Ya existe un proveedor con este RUC' });
  }

  // Validar si el teléfono y correo electrónico ya existen (opcional)
  if (telefono) {
    const proveedorTelefonoExistente = await Proveedor.findOne({ where: { telefono } });
    if (proveedorTelefonoExistente) {
      return res.status(400).json({ error: 'Ya existe un proveedor con este número de teléfono' });
    }
  }

  if (correo_electronico) {
    const proveedorCorreoExistente = await Proveedor.findOne({ where: { correo_electronico } });
    if (proveedorCorreoExistente) {
      return res.status(400).json({ error: 'Ya existe un proveedor con este correo electrónico' });
    }
  }

  try {
    // Crear un nuevo proveedor
    const nuevoProvedor = await Proveedor.create({
      nombre,
      tipo_proveedor: tipo_proveedor || null,  // Usamos null si no se proporciona
      ruc_cif,
      telefono: telefono || null,  // Usamos null si no se proporciona
      correo_electronico: correo_electronico || null,
      direccion_fisica: direccion_fisica || null,
      persona_contacto: persona_contacto || null,
      telefono_contacto: telefono_contacto || null,
      plazo_pago: plazo_pago || null,
      metodo_pago: metodo_pago || null,
      moneda: moneda || null,
      descuento_volumen: descuento_volumen || null,
      condiciones_entrega: condiciones_entrega || null,
      fecha_ultimo_pedido: fecha_ultimo_pedido || null,
      monto_total_compras: monto_total_compras || null,
      estado: estado || 'activo',  // Si no se proporciona, se establece como 'activo' por defecto
      calificacion: calificacion || null,
      historico_devoluciones: historico_devoluciones || null
    });

    return res.status(201).json({ mensaje: 'Proveedor agregado con éxito', Proveedor: nuevoProvedor });
  } catch (error) {
    console.error('Error al agregar Proveedor:', error);
    return res.status(500).json({ error: 'Error al agregar el Proveedor' });
  }
};


const actualizarProvedorPorId = async (req, res) => {
  try {
    // Captura el ID desde los parámetros de la URL
    const id_proveedores = req.params.id_proveedores;
    if (!id_proveedores) {
      return res.status(400).json({
        mensaje: 'El ID de la Provedor es requerido.',
      });
    }

    // Captura el resto de los datos desde el cuerpo de la solicitud
    const {
      nombre,
      tipo_proveedor,
      ruc_cif,
      telefono,
      correo_electronico,
      direccion_fisica,
      persona_contacto,
      telefono_contacto,
      plazo_pago,
      metodo_pago,
      moneda,
      descuento_volumen,
      condiciones_entrega,
      fecha_ultimo_pedido,
      monto_total_compras,
      estado,
      calificacion,
      historico_devoluciones
    } = req.body;

    // Verifica si el ID es válido antes de intentar actualizar
    const [actualizado] = await Proveedor.update(
      {
        nombre,
        tipo_proveedor,
        ruc_cif,
        telefono,
        correo_electronico,
        direccion_fisica,
        persona_contacto,
        telefono_contacto,
        plazo_pago,
        metodo_pago,
        moneda,
        descuento_volumen,
        condiciones_entrega,
        fecha_ultimo_pedido,
        monto_total_compras,
        estado,
        calificacion,
        historico_devoluciones
      },
      { where: { id_proveedores: id_proveedores } } // Usar el ID para encontrar y actualizar
    );

    if (!actualizado) {
      return res.status(404).json({
        mensaje: 'Proveedor no encontrado.',
      });
    }

    // Respuesta exitosa
    res.json({
      mensaje: 'Proveedor actualizado exitosamente.',
    });
  } catch (error) {
    console.error('Error al actualizar el Proveedor:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar el Proveedor',
      detalles: error.message,
    });
  }
};



const eliminarProvedorPorId = async (req, res) => {
  try {
    const { id_proveedores } = req.params;
    console.log('Intentando eliminar Proveedor con ID:', id_proveedores);

    // Elimina el Proveedor por su ID
    const ProvedorEliminado = await Proveedor.destroy({
      where: { id_proveedores }
    });

    if (ProvedorEliminado === 0) {
      console.log('Proveedor no encontrado con ID:', id_proveedores);
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    console.log('Proveedor eliminado correctamente con ID:', id_proveedores);
    return res.status(200).json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el Proveedor:', error);
    console.error('Detalles del error:', error.stack); // Muestra la pila de llamadas completa
    return res.status(500).json({ error: 'Error al eliminar el Proveedor' });
  }
};


module.exports = {
  obtenerProvedor,
  agregarProvedor,
  actualizarProvedorPorId,
  eliminarProvedorPorId

};

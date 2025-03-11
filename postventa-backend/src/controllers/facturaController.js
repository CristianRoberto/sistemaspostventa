const Factura = require('../models/factura');
const Venta = require('../models/venta');
const Cliente = require('../models/cliente');
const Empleado = require('../models/empleado');




// Obtener todos los Ventass
const obtenerFactura = async (req, res) => {
  try {
    console.log('Solicitud de obtener facturas recibida');  // Mensaje de depuración

    const facturas = await Factura.findAll({
      attributes: ['factura_id', 'numero_factura', 'fecha_emision', 'fecha_vencimiento', 'estado', 'total', 'impuestos', 'metodo_pago', 'estado_pago'], // Solo lo que necesitas
      include: [
        {
          model: Venta,
          as: 'venta',
          attributes: ['venta_id', 'total', 'metodo_pago', 'fecha'], // Solo lo que necesitas
          include: [
            {
              model: Cliente,
              as: 'cliente',
              attributes: ['cliente_id', 'nombre', 'email'], // Solo lo que necesitas
            },
            {
              model: Empleado,
              as: 'empleado',
              attributes: ['empleado_id', 'nombre', 'puesto'],
            }
          ]
        }
      ]
    });
    
    

    console.log('Facturas obtenidas:', facturas);  // Para verificar los datos obtenidos

    return res.status(200).json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas:', error);  // Manejo de errores
    return res.status(500).json({ error: 'Error al obtener las facturas' });
  }
};




module.exports = {
    obtenerFactura,  
    // agregarFactura, eliminarFacturaId, actualizarFacturaPorId
  };
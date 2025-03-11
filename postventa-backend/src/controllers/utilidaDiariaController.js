const moment = require('moment');
const Venta = require('../models/venta');
const DetalleVenta = require('../models/detalleventa');
const CompraProducto = require('../models/CompraProducto');



const calcularUtilidadDiaria = async (fecha) => {
  const fechaInicio = moment(fecha).startOf('day').toDate();
  const fechaFin = moment(fecha).endOf('day').toDate();

  try {
    const ventas = await Venta.findAll({
      where: {
        fecha_venta: {
          [Sequelize.Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [
        {
          model: DetalleVenta,
          as: 'ventas_detalles', // Asegúrate de que este alias coincide con la relación en tu modelo
          include: [
            {
              model: CompraProducto,
              as: 'compra', // Verifica que el alias en el modelo sea el correcto
              attributes: ['precio_compra']
            }
          ]
        }
      ]
    });

    let utilidadDiaria = 0;

    for (const venta of ventas) {
      let costoTotal = 0;

      for (const detalle of venta.ventas_detalles) {
        const cantidadVendida = detalle.cantidad;
        const precioCompra = detalle.compra ? detalle.compra.precio_compra : 0; // Manejo de valores nulos
        costoTotal += cantidadVendida * precioCompra;
      }

      const utilidadVenta = venta.total_venta - costoTotal;
      utilidadDiaria += utilidadVenta;
    }

    return { fecha, utilidadDiaria };
  } catch (error) {
    console.error('Error al calcular utilidad diaria:', error);
    return { error: 'No se pudo calcular la utilidad diaria' };
  }
};




module.exports = {
    calcularUtilidadDiaria
  };
  

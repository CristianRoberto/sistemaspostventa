const Venta = require('../models/venta');
const CompraProducto = require('../models/CompraProducto');
const Devolucion = require('../models/devolucion');
const PagoAdicional = require('../models/pagoAdicional');
const Utilidad = require('../models/utilidad'); // Importamos el modelo

const { Op, Sequelize } = require('sequelize');
const moment = require('moment');
const dayjs = require('dayjs');  // Usar Day.js para manipular fechas
const timezone = require('dayjs/plugin/timezone'); // Importar el plugin de zonas horarias
const utc = require('dayjs/plugin/utc'); // Importar el plugin de UTC

// Extender Day.js con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);


const calcularUtilidadDiaria = async (req, res) => {
  try {
    let { fecha_inicio, fecha_fin } = req.body; // Obtener las fechas desde el cuerpo de la solicitud

    console.log('las fecha inicio :', fecha_inicio )

    console.log('las fecha inicio :', fecha_fin )

    // // Si no se proporcionan las fechas, usamos las fechas actuales
    // if (!fecha_inicio) {
    //   fecha_inicio = dayjs().tz('America/Guayaquil').startOf('day').format('YYYY-MM-DD');
    // }

    // if (!fecha_fin) {
    //   fecha_fin = dayjs().tz('America/Guayaquil').endOf('day').format('YYYY-MM-DD');
    // }

    // // Convertir las fechas a la zona horaria de Guayaquil
    const fechaInicioFinal = dayjs(fecha_inicio).tz('America/Guayaquil').startOf('day').toDate(); // Poner a las 00:00:00
    const fechaFinFinal = dayjs(fecha_fin).tz('America/Guayaquil').endOf('day').toDate(); // Poner a las 23:59:59

    // console.log('Fecha inicio:', fechaInicioFinal);
    // console.log('Fecha fin:', fechaFinFinal);

    // // Consultar las ventas, devoluciones, compras, etc. dentro de ese rango de fechas
    const ventas = await Venta.sum('total', {
      where: {
        fecha: {
          [Op.between]: [fechaInicioFinal, fechaFinFinal] // Filtrar por el rango de fechas
        }
      }
    });
    console.log('ventas total:',ventas )

    const devoluciones = await Devolucion.sum('monto_devolucion', {
      where: {
        fecha_devolucion: {
          [Op.between]: [fechaInicioFinal, fechaFinFinal] // Filtrar por el rango de fechas
        }
      }
    });
    
    // Si no hay devoluciones, asignamos 0
    const totalDevoluciones = devoluciones || 0;
    
    console.log('ventas devoluciones:', totalDevoluciones);
    
    const compras = await CompraProducto.sum('total_compra', {
      where: {
        fecha_compra: {
          [Op.between]: [fechaInicioFinal, fechaFinFinal] // Filtrar por el rango de fechas
        }
      }
    });
    const totalcompras = compras || 0;


    console.log('total de compras :', totalcompras);


    const pagosAdicionales = await PagoAdicional.sum('monto', {
      where: {
        fecha: {
          [Op.between]: [fechaInicioFinal, fechaFinFinal] // Filtrar por el rango de fechas
        }
      }
    });

    // Calcular la utilidad bruta y utilidad diaria
    const utilidadBruta = (ventas || 0) - (devoluciones || 0) - (compras || 0);
    const utilidadDiaria = utilidadBruta - (pagosAdicionales || 0);

    // Crear o actualizar el registro de utilidad diaria
    const utilidad = await Utilidad.create({
      fecha: fechaInicioFinal, // Fecha del cálculo
      ventas: ventas || 0,
      devoluciones: devoluciones || 0,
      compras: compras || 0,
      utilidad_bruta: utilidadBruta,
      pagos_adicionales: pagosAdicionales || 0,
      utilidad_diaria: utilidadDiaria
    });

     res.status(200).json(utilidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al calcular la utilidad diaria', error });
  }
};


const verUtilidadDiaria = async (req, res) => {
  try {
    console.log('Solicitud de obtener ventas recibida');  // Mensaje inicial para verificar si la solicitud llega

    const utilidad = await Utilidad.findAll({
      order: [["utilidad_id", "DESC"]],

      // include: [
      //   {
      //     model: Cliente,
      //     as: 'cliente',  // Si usas alias, debes agregarlo aquí
      //     required: true
      //   },
      //   {
      //     model: Empleado,
      //     as: 'empleado',  // Si usas alias, debes agregarlo aquí
      //     required: true
      //   }
      // ]
    });

    console.log('Utilidad obtenidas:', utilidad);  // Para ver qué datos devuelve la consulta

    return res.status(200).json(utilidad);
  } catch (error) {
    console.error('Error al obtener ventas:', error);  // Imprime el error en caso de que ocurra algo en el try
    return res.status(500).json({ error: 'Error al obtener la utilidad' });
  }
};




module.exports = { calcularUtilidadDiaria, verUtilidadDiaria };

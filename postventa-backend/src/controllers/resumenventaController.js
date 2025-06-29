const Venta = require('../models/venta');
const sequelize = require('../config/db');



const obtenerResumenVentasMensuales = async (req, res) => {
  try {
    const result = await Venta.findAll({
      attributes: [
        [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM fecha')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total']
      ],
      group: [sequelize.literal('mes')],
      order: [[sequelize.literal('mes'), 'ASC']],
      raw: true
    });

    res.json(result);
  } catch (error) {
    console.error("Error al obtener ventas mensuales:", error);
    res.status(500).json({ error: "Error al obtener ventas mensuales" });
  }
};


const obtenerResumenVentas = async (req, res) => {
    try {
      const today = new Date();
      const fechaHoy = today.toISOString().split('T')[0]; // YYYY-MM-DD
      const mesActual = today.getMonth() + 1;
      const anioActual = today.getFullYear();
  
      // Ventas Totales
      const totalVentas = await Venta.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ]
      });
  
      // Ventas del Mes
      const totalVentasMes = await Venta.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        where: sequelize.and(
          sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "fecha"')), mesActual),
          sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "fecha"')), anioActual)
        )
      });
  
      // Ventas del Día
      const totalVentasDia = await Venta.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        where: sequelize.where(
          sequelize.fn('DATE', sequelize.col('fecha')),
          fechaHoy
        )
      });
  
      res.json({
        total: parseFloat(totalVentas?.get('total') ?? 0),
        mes: parseFloat(totalVentasMes?.get('total') ?? 0),
        dia: parseFloat(totalVentasDia?.get('total') ?? 0)
      });
    } catch (error) {
      console.error('Error al obtener resumen de ventas:', error);
      res.status(500).json({ error: 'Error al obtener resumen de ventas' });
    }
  };
  

module.exports = {
  obtenerResumenVentas,
  obtenerResumenVentasMensuales
};

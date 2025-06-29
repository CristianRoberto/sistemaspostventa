const { Op } = require('sequelize');
const { Sequelize } = require('sequelize'); // Asegúrate de importar Sequelize correctamente
const CierreCaja = require('../models/cierrecaja'); // Importamos el modelo de CierreCaja
const Venta = require('../models/venta'); // Importamos el modelo de Venta

const Cliente = require('../models/cliente'); // Importamos el modelo de Venta
const Empleado = require('../models/empleado');




// Obtener todos los CierreCaja
const obtenerCierreCaja = async (req, res) => {
    try {
        const cierresCaja = await CierreCaja.findAll({
            order: [["id", "DESC"]],

            include: [
                {
                    model: Empleado, // Relación con Cliente
                    as: 'empleado',  // Alias que definimos en la relación
                    attributes: ['empleado_id', 'nombre'], // Los atributos que deseas incluir del cliente
                },
            ],
        });

        if (!cierresCaja.length) {
            return res.status(404).json({ mensaje: 'No hay Cierres de Caja registrados.' });
        }

        return res.status(200).json(cierresCaja);
    } catch (error) {
        console.error('Error al obtener CierreCaja:', error);
        return res.status(500).json({ error: 'Error al obtener los Cierres de Caja', detalles: error.message });
    }
};

// Agregar un inventario
const inicioCaja = async (req, res) => {
    const { monto_inicial, estado, empleado_id } = req.body;
    console.log("este es mi contenido recibido:", req.body);

    // Convertir monto_inicial a número y empleado_id a entero
    const montoInicialDecimal = parseFloat(monto_inicial);
    const empleadoId = parseInt(empleado_id);

    // Verificar si los datos son válidos
    if (isNaN(montoInicialDecimal) || isNaN(empleadoId)) {
        return res.status(400).json({ error: "Datos inválidos. Asegúrate de que monto_inicial y empleado_id sean números." });
    }

    try {
        const nuevoTurno = await CierreCaja.create({
            monto_inicial: montoInicialDecimal,
            estado: estado || 'abierto', // Si el estado no se proporciona, será 'abierto' por defecto
            empleado_id: empleadoId
        });
        res.status(201).json(nuevoTurno);
    } catch (error) {
        console.error("Error al registrar la apertura de caja:", error); // Imprimir detalles del error
        res.status(500).json({ error: "Error al registrar la apertura de caja", detalles: error.message });
    }
}


const cerrarCaja = async (req, res) => {
    const { id, efectivo_final, tarjeta_final } = req.body;

    console.log("Datos recibidos para cerrar caja:", req.body);

    // Validar que los datos recibidos sean números válidos
    if (isNaN(id) || isNaN(efectivo_final) || isNaN(tarjeta_final)) {
        console.log("Faltan datos válidos en la solicitud:", req.body);
        return res.status(400).json({ error: "Faltan datos para cerrar la caja o los datos no son válidos" });
    }

    try {
        console.log("Buscando el cierre de caja con ID:", id);
        const cierreCaja = await CierreCaja.findByPk(id);

        if (!cierreCaja) {
            console.log("Cierre de caja no encontrado con ID:", id);
            return res.status(404).json({ error: "Cierre de caja no encontrado." });
        }

        console.log("Fecha de apertura de caja:", cierreCaja.fecha_apertura);

        // Obtener el monto inicial de la caja
        const montoInicial = parseFloat(cierreCaja.monto_inicial) || 0.00;
        console.log("Monto inicial en caja:", montoInicial);

        // Calcular total de ventas realizadas (solo ventas con estado "pagada")
        const ventasRealizadas = await Venta.sum('total', {
            where: {
                empleado_id: cierreCaja.empleado_id,
                estado: 'pagada',
                fecha: { [Sequelize.Op.gte]: cierreCaja.fecha_apertura }
            },
        });
        
        console.log("Ventas realizadas:", ventasRealizadas);
        

        const totalVentas = ventasRealizadas ? parseFloat(ventasRealizadas) : 0.00;
        console.log("Total de ventas registradas:", totalVentas);

        // Calcular cuánto dinero debería haber en caja
        const totalEsperadoEfectivo = montoInicial + totalVentas;
        console.log("Total esperado en efectivo:", totalEsperadoEfectivo);

        // Calcular la diferencia con el dinero reportado por el cajero
        const diferencia = (parseFloat(efectivo_final) + parseFloat(tarjeta_final)) - totalEsperadoEfectivo;
        console.log("Diferencia calculada:", diferencia);

        // Actualizar el cierre de caja con los valores calculados
        console.log("Actualizando el cierre de caja...");
        await cierreCaja.update({
            fecha_cierre: new Date(),
            total_ventas: totalVentas,
            efectivo_final: parseFloat(efectivo_final),
            tarjeta_final: parseFloat(tarjeta_final),
            total_cierrecaja_efectivo: totalEsperadoEfectivo,  // 🔹 Guardar en la BD
            diferencia,
            estado: 'cerrado',
        });


        console.log("Caja cerrada correctamente.");
        res.status(200).json({ message: "Caja cerrada correctamente", cierreCaja });
    } catch (error) {
        console.error("Error al cerrar la caja:", error);
        res.status(500).json({ error: "Error al cerrar la caja", detalles: error.message });
    }
};





module.exports = {
    cerrarCaja,
    obtenerCierreCaja,
    inicioCaja
};
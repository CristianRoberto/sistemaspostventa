const pagoAdicional = require("../models/pagoAdicional");
const Proveedor = require("../models/provedores");
const PagoAdicional = require("../models/pagoAdicional");
const Capital = require("../models/capital");  // Modelo de capital para actualizar el capital disponible
const { Op } = require("sequelize");

const obtenerPago = async (req, res) => {
  try {
    const pagos = await pagoAdicional.findAll({
      include: [
        {
          model: Proveedor,
          as: "proveedor", // Asegúrate de que este alias esté definido en la relación
        },
      ],
    });

    return res.status(200).json(pagos);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    return res.status(500).json({ error: "Error al obtener los pagos" });
  }
};




const insertarPago = async (req, res) => {
  try {
    const { monto, concepto, tipo_pago, id_proveedor, empleado_id, cliente_id } = req.body;

    // Validar que los campos necesarios estén presentes
    if (!monto || !concepto || !tipo_pago) {
      return res.status(400).json({ error: "Los campos monto, concepto y tipo_pago son requeridos." });
    }

    // Verificar que el monto no sea negativo
    if (monto <= 0) {
      return res.status(400).json({ error: "El monto debe ser mayor a cero." });
    }

    // Crear el nuevo pago adicional
    const nuevoPago = await PagoAdicional.create({
      fecha: new Date(),  // Usando la fecha actual
      monto,
      concepto,
      tipo_pago,
      id_proveedor: id_proveedor || null,  // Permite que id_proveedor sea null
      empleado_id: empleado_id || null,  // Si no hay empleado, se puede dejar como null
      cliente_id: cliente_id || null,  // Lo mismo para cliente_id
    });

    console.log("Pago adicional creado:", nuevoPago);

    // Resta el total de pagos del capital disponible
    const capital = await Capital.findOne();  // Obtiene el primer registro de capital
    if (!capital) {
      return res.status(404).json({ error: "Capital no encontrado." });
    }

    console.log("Capital antes del pago:", capital.monto);

    capital.monto -= monto;  // Restamos el monto del pago del capital
    await capital.save();  // Guardar el nuevo monto de capital

    console.log("Nuevo capital después del pago:", capital.monto);

    return res.status(201).json(nuevoPago);
  } catch (error) {
    console.error("Error al insertar el pago adicional:", error);
    return res.status(500).json({ error: "Error al insertar el pago adicional" });
  }
};



module.exports = { obtenerPago, insertarPago };

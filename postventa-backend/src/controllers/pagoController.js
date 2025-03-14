const pagoAdicional = require("../models/pagoAdicional");
const Proveedor = require("../models/provedores");
const PagoAdicional = require("../models/pagoAdicional");
const Capital = require("../models/capital");
const { Op } = require("sequelize");

const obtenerPago = async (req, res) => {
  try {
    const pagos = await pagoAdicional.findAll({
      include: [{ model: Proveedor, as: "proveedor" }],
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

    if (!monto || !concepto || !tipo_pago) {
      return res.status(400).json({ error: "Los campos monto, concepto y tipo_pago son requeridos." });
    }

    if (monto <= 0) {
      return res.status(400).json({ error: "El monto debe ser mayor a cero." });
    }

    const nuevoPago = await PagoAdicional.create({
      fecha: new Date(),
      monto,
      concepto,
      tipo_pago,
      id_proveedor: id_proveedor || null,
      empleado_id: empleado_id || null,
      cliente_id: cliente_id || null,
    });

    const capital = await Capital.findOne();
    if (!capital) return res.status(404).json({ error: "Capital no encontrado." });

    capital.monto -= monto;
    await capital.save();

    return res.status(201).json(nuevoPago);
  } catch (error) {
    console.error("Error al insertar el pago adicional:", error);
    return res.status(500).json({ error: "Error al insertar el pago adicional" });
  }
};


const actualizarPago = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const { monto, concepto, tipo_pago, id_proveedor, empleado_id, cliente_id } = req.body;

    console.log("ID del pago:", id_pago);
    console.log("Datos recibidos para actualizar:", {
      monto,
      concepto,
      tipo_pago,
      id_proveedor,
      empleado_id,
      cliente_id
    });

    const pago = await PagoAdicional.findByPk(id_pago);
    if (!pago) {
      console.log("Pago no encontrado.");
      return res.status(404).json({ error: "Pago adicional no encontrado." });
    }
    console.log("Pago encontrado:", pago);

    const capital = await Capital.findOne();
    if (!capital) {
      console.log("Capital no encontrado.");
      return res.status(404).json({ error: "Capital no encontrado." });
    }
    console.log("Capital encontrado:", capital);

    // Actualización del capital antes de modificar el pago
    console.log("Actualizando capital. Monto previo:", capital.monto);
    console.log("Actualizando capital. Monto previo:", capital.monto);

    // Asegúrate de que tanto `capital.monto` como `pago.monto` sean números válidos
    const montoCapital = parseFloat(capital.monto);
    const montoPago = parseFloat(pago.monto);

    if (isNaN(montoCapital) || isNaN(montoPago)) {
      throw new Error("Monto no válido para actualización");
    }

    // Realiza la suma solo si ambos montos son números válidos
    capital.monto = montoCapital + montoPago;

    await capital.save();
    console.log("Capital actualizado. Nuevo monto:", capital.monto);


    // Actualización del pago
    pago.monto = monto || pago.monto;
    pago.concepto = concepto || pago.concepto;
    pago.tipo_pago = tipo_pago || pago.tipo_pago;
    pago.id_proveedor = id_proveedor || null;
    pago.empleado_id = empleado_id || null;
    pago.cliente_id = cliente_id || null;

    console.log("Datos actualizados del pago:", pago);
    await pago.save();

    // Actualización del capital después de modificar el pago
    console.log("Restaurando capital. Monto previo:", capital.monto);
    capital.monto -= pago.monto;  // Reducir el capital después de actualizar el pago
    await capital.save();
    console.log("Capital restaurado. Nuevo monto:", capital.monto);

    return res.status(200).json(pago);
  } catch (error) {
    console.error("Error al actualizar el pago adicional:", error);
    return res.status(500).json({ error: "Error al actualizar el pago adicional" });
  }
};


const eliminarPago = async (req, res) => {
  try {
    const { id_pago } = req.params;

    const pago = await PagoAdicional.findByPk(id_pago);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado." });

    const capital = await Capital.findOne();
    if (!capital) return res.status(404).json({ error: "Capital no encontrado." });

    console.log("Capital antes de eliminar pago:", capital.monto);
    console.log("Monto a devolver al capital:", pago.monto);

    // Validamos que el monto sea un número válido y lo sumamos correctamente
    const nuevoMonto = parseFloat(capital.monto) + parseFloat(pago.monto);

    console.log("Nuevo capital después del pago eliminado:", nuevoMonto);

    // Aseguramos que el monto sea un número válido antes de actualizar
    if (isNaN(nuevoMonto)) {
      return res.status(400).json({ error: "Error en el cálculo del capital." });
    }

    // Actualizamos el capital
    capital.monto = nuevoMonto;
    await capital.save();

    // Eliminamos el pago
    await pago.destroy();

    return res.status(200).json({ message: "Pago eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el pago adicional:", error);
    return res.status(500).json({ error: "Error al eliminar el pago adicional" });
  }
};


module.exports = { obtenerPago, insertarPago, actualizarPago, eliminarPago };

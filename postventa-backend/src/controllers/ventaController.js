const Venta = require('../models/venta');
const Producto = require('../models/producto');
const DetalleVenta = require('../models/detalleventa');
const Empleado = require('../models/empleado');
const Cliente = require('../models/cliente');
const Inventario = require('../models/inventario');
const TransaccionPuntos = require('../models/TransaccionPuntos');
const Factura = require('../models/factura');




// const { Sequelize, Op } = require('sequelize');
// Si tienes la instancia de Sequelize en otro archivo de configuración
const sequelize = require('../config/db');  // Importa desde la carpeta /config
const nodemailer = require('nodemailer');


const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const obtenerVentas = async (req, res) => {
  try {
    console.log('Solicitud de obtener ventas recibida');  // Mensaje inicial para verificar si la solicitud llega

    const ventas = await Venta.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',  // Si usas alias, debes agregarlo aquí
          required: true
        },
        {
          model: Empleado,
          as: 'empleado',  // Si usas alias, debes agregarlo aquí
          required: true
        }
      ]
    });

    console.log('Ventas obtenidas:', ventas);  // Para ver qué datos devuelve la consulta

    return res.status(200).json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);  // Imprime el error en caso de que ocurra algo en el try
    return res.status(500).json({ error: 'Error al obtener las ventas' });
  }
};



const generarFacturaPDF = (numeroFactura, cliente, detallesVenta, total, impuesto) => {
  return new Promise((resolve, reject) => {
    // Crear el documento PDF
    const doc = new PDFDocument();

    // Definir la ruta completa donde se guardará la factura
    const filePath = path.join(__dirname, 'facturas', `factura_${numeroFactura}.pdf`);  // Usamos el numeroFactura aquí

    console.log(`Generando archivo en: ${filePath}`);

    // Crear el stream de escritura en el archivo
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream); // Escribir el PDF en el archivo

    // Encabezado de la factura
    doc.fontSize(16).text("Factura de Compra", { align: "center" });
    doc.fontSize(12).text("------------------------------------------------------", { align: "center" });
    doc.fontSize(12).text("Nombre de la Empresa: SISTEMAS", { align: "center" });
    doc.text("Dirección: Calle Ficticia 123, Ciudad, País");
    doc.text("Teléfono: (123) 456-7890");
    doc.text("Correo: contacto@empresa.com");
    doc.text("Número de Identificación Fiscal: 123456789");
    doc.moveDown();

    // Información de la venta
    // Deberías usar numeroFactura en lugar de ventaId
    doc.fontSize(12).text(`Venta ID: ${numeroFactura}`);  // Usar numeroFactura
    doc.text(`Cliente: ${cliente.nombre || 'N/A'}`);
    doc.text(`Dirección: ${cliente.direccion || 'No disponible'}`);
    doc.text(`Correo: ${cliente.email || 'No registrado'}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Detalles de los productos/servicios
    doc.fontSize(14).text("Detalles de la compra:", { underline: true });
    doc.moveDown();

    detallesVenta.forEach(detalle => {
      doc.text(`Id Producto: ${detalle.producto_id}`);
      doc.text(`Nombre Producto: ${detalle.nombreProducto || 'Desconocido'}`);
      doc.text(`Cantidad: ${detalle.cantidad}`);
      doc.text(`Precio unitario: $${detalle.precio.toFixed(2)}`);
      doc.moveDown();
    });

    // Resumen de la factura
    doc.text("------------------------------------------------------");
    doc.fontSize(14).text(`Subtotal: $${total.toFixed(2)}`, { align: "right" });
    doc.fontSize(14).text(`IVA: $${impuesto.toFixed(2)}`, { align: "right" });

    // Total final después de descuentos e IVA
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: "right" });
    doc.moveDown();

    // Términos y condiciones
    doc.fontSize(12).text("------------------------------------------------------");
    doc.text("Términos y condiciones:", { underline: true });
    doc.text("1. Política de devoluciones: No hay devoluciones después de 30 días.");
    doc.text("2. Condiciones de pago: Pago total a la entrega.");
    doc.text("3. Tiempo de entrega: 5-7 días hábiles.");
    doc.moveDown();

    // Método de pago
    doc.fontSize(12).text("Método de pago: Tarjeta de Crédito (Visa)");
    doc.text("Número de referencia: 1234567890");
    doc.moveDown();

    // Notas adicionales
    doc.fontSize(12).text("------------------------------------------------------");
    doc.text("Gracias por su compra. ¡Esperamos verlo pronto!");

    doc.end(); // Terminar la escritura del PDF

    // Verificar si el archivo fue creado correctamente
    stream.on("finish", () => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('El archivo no se ha creado:', err);
          reject(new Error('Error al generar el archivo.'));
        } else {
          console.log('Archivo generado con éxito en:', filePath);
          resolve(filePath); // Devuelve la ruta del archivo generado
        }
      });
    });

    stream.on("error", (error) => {
      console.error('Error al generar el archivo:', error);
      reject(error); // Rechazar en caso de error
    });
  });
};



const generarNumeroFactura = (venta_id) => {
  const prefijo = 'FAC';  // Prefijo de la factura
  const anio = new Date().getFullYear();  // Año actual
  return `${prefijo}-${venta_id}-${anio}`;
};



const crearVenta = async (req, res) => {
  const { cliente_id, empleado_id, productos, metodo_pago, estado, fecha, enviar_factura } = req.body;
  console.log('📌 Datos de la venta recibidos:', req.body);

  // Verificar si el cliente_id está presente
  if (!cliente_id) {
    return res.status(400).json({ error: 'El campo "cliente" es obligatorio.' });
  }

  // Verificar si el empleado_id está presente
  if (!empleado_id) {
    return res.status(400).json({ error: 'El campo "empleado" es obligatorio.' });
  }

  // Verificar si productos no está vacío y tiene al menos un producto
  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: 'Debe haber al menos un producto en la venta.' });
  }

  // Verificar si el metodo_pago está presente
  if (!metodo_pago) {
    return res.status(400).json({ error: 'El campo "metodo_pago" es obligatorio.' });
  }

  // Verificar si el estado está presente
  if (!estado) {
    return res.status(400).json({ error: 'El campo "estado" es obligatorio.' });
  }

  // Validar enviar_factura (opcional)
  if (enviar_factura !== undefined && typeof enviar_factura !== 'boolean') {
    return res.status(400).json({ error: 'El campo "enviar_factura" debe ser un valor booleano.' });
  }

  const empleado = await Empleado.findByPk(empleado_id);
  if (!empleado) {
    console.log('❌ Empleado no encontrado:', empleado_id);
    return res.status(404).json({ error: 'Empleado no encontrado' });
  }

  // Obtener al cliente antes de iniciar la transacción
  const cliente = await Cliente.findByPk(cliente_id);
  if (!cliente) {
    console.log('❌ Cliente no encontrado:', cliente_id);
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  try {
    console.log('✅ Productos recibidos:', productos);
    let total = 0;
    let impuestoTotal = 0; // Variable global para sumar impuestos
    const detalles = [];

    const productosDb = await Producto.findAll({
      where: { producto_id: productos.map(item => item.producto_id) },
    });

    // Verificación de stock y cálculos de la venta
    const productosSinStock = [];  // Array para almacenar los productos con stock insuficiente

    // Verificación de stock y cálculos de la venta
    for (const item of productos) {
      const producto = productosDb.find(p => p.producto_id === item.producto_id);
      if (!producto) {
        console.log(`❌ Producto no encontrado: ${item.producto_id}`);
        return res.status(400).json({ error: `Producto no encontrado para ID ${item.producto_id}` });
      }

      // Verificar el stock en Inventario
      const inventario = await Inventario.findOne({ where: { producto_id: item.producto_id } });
      if (!inventario || inventario.cantidad < item.cantidad) {
        console.log(`❌ Stock insuficiente para el producto ${producto.nombre}`);
        productosSinStock.push(producto.nombre);  // Agregar el nombre del producto a la lista
      } else {
        const precioNumber = parseFloat(producto.precio);
        if (isNaN(precioNumber) || precioNumber <= 0 || typeof item.cantidad !== 'number' || item.cantidad <= 0) {
          console.log(`❌ Error en cantidad o precio del producto ${producto.producto_id}`);
          return res.status(400).json({ error: `Cantidad o precio inválido para el producto ${producto.producto_id}` });
        }

        const subtotal = item.cantidad * precioNumber;
        const impuesto = subtotal * ((producto.iva || 0) / 100);
        impuestoTotal += impuesto;

        total += subtotal + impuesto;

        detalles.push({
          producto_id: item.producto_id,
          nombreProducto: producto.nombre,
          cantidad: item.cantidad,
          precio: precioNumber,
          impuestoCalculado: impuesto
        });

        console.log(`✅ Producto agregado: ${producto.nombre}, Cantidad: ${item.cantidad}, Subtotal: ${subtotal}, IVA: ${impuesto}`);
      }
    }

    // Si hay productos sin stock, devolver el error con todos los nombres
    if (productosSinStock.length > 0) {
      console.log(`❌ Actualizar Stock insuficiente para los siguientes productos: ${productosSinStock.join(', ')}`);
      return res.status(400).json({
        error: `Actualizar Stock, cantidad productos insuficientes:\n${productosSinStock.join(', ')}`
      });
    }

    console.log('🔹 Total de la venta:', total);
    console.log('🔹 IVA total:', impuestoTotal);


    const transaction = await sequelize.transaction();
    try {
      console.log('🔄 Iniciando transacción...');

      // Crear la venta
      const venta = await Venta.create(
        { cliente_id, empleado_id, total, metodo_pago, estado, fecha },
        { transaction }
      );

      if (!venta.venta_id) {
        console.log('❌ Error: La venta no tiene un ID válido');
        return res.status(500).json({ error: 'Error al generar la venta' });
      }

      // Generar número de factura después de haber creado la venta
      const numeroFactura = generarNumeroFactura(venta.venta_id);

      // Registrar los detalles de la venta y actualizar inventario
      for (const detalle of detalles) {
        await DetalleVenta.create(
          { producto_id: detalle.producto_id, cantidad: detalle.cantidad, precio: detalle.precio, venta_id: venta.venta_id },
          { transaction }
        );

        // Actualizamos el stock en la tabla Inventario
        await Inventario.update(
          { cantidad: sequelize.literal('cantidad - ' + detalle.cantidad) },
          { where: { producto_id: detalle.producto_id }, transaction }
        );
      }

      // 1. Calcular los puntos ganados (1 punto por cada dólar gastado)
      const puntosGanados = Math.floor(total);  // Truncar a entero
      console.log(`✅ Puntos ganados: ${puntosGanados} puntos`);

      // 2. Actualizar los puntos acumulados del cliente
      console.log(`🔄 Actualizando puntos acumulados para el cliente con ID: ${cliente_id}`);
      await Cliente.update(
        {
          total_puntos_acumulados: sequelize.literal(`COALESCE(total_puntos_acumulados, 0) + ${puntosGanados}`)
        },
        { where: { cliente_id }, transaction }
      );
      console.log(`✅ Puntos acumulados actualizados para el cliente con ID: ${cliente_id}`);

      // 3. Insertar la transacción de puntos
      console.log(`🔄 Insertando transacción de puntos para el cliente con ID: ${cliente_id}`);
      await TransaccionPuntos.create(
        { cliente_id, tipo_accion: 'compra', puntos: puntosGanados },
        { transaction }
      );
      console.log(`✅ Transacción de puntos insertada para el cliente con ID: ${cliente_id}`);




      // Crear la factura vinculada a la venta
      const factura = await Factura.create(
        {
          venta_id: venta.venta_id,
          numero_factura: numeroFactura,
          total,
          impuestos: impuestoTotal,
          estado: estado,
          estado_pago: 'pendiente',
          metodo_pago: metodo_pago,
          cliente_id: cliente_id // Asegurarse de incluir el cliente_id
        },
        { transaction }
      );

      console.log(`✅ Factura registrada con éxito. ID: ${factura.factura_id}, Número de factura: ${factura.numero_factura}`);

      // Solo generar y enviar la factura si el parámetro enviar_factura es true
      if (enviar_factura) {
        const filePath = await generarFacturaPDF(factura.numero_factura, cliente, detalles, total, impuestoTotal);
        await enviarFactura(cliente?.email, filePath, venta.venta_id);
      }

      // if (enviar_factura) {
      //   // Crear la factura vinculada a la venta
      //   const factura = await Factura.create(
      //     {
      //       venta_id: venta.venta_id,
      //       numero_factura: numeroFactura,
      //       total,
      //       impuestos: impuestoTotal,
      //       estado: estado,
      //       estado_pago: 'pendiente',
      //       metodo_pago: metodo_pago
      //     },
      //     { transaction }
      //   );
      //   console.log(`✅ Factura registrada con éxito. ID: ${factura.factura_id}, Número de factura: ${factura.numero_factura}`);

      //   // Generamos y enviamos la factura
      //   const filePath = await generarFacturaPDF(factura.numero_factura, cliente, detalles, total, impuestoTotal);
      //   await enviarFactura(cliente?.email, filePath, venta.venta_id);
      // }


      // Confirmamos la transacción
      await transaction.commit();
      console.log(`✅ Venta registrada con éxito. ID: ${venta.venta_id}`);

      res.json({ message: 'Venta realizada con éxito', venta_id: venta.venta_id, numero_factura: numeroFactura });

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error en la transacción:', error);
      res.status(500).json({ error: 'Error al procesar la venta' });
    }
  } catch (error) {
    console.error('❌ Error en crearVenta:', error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  }
};






const enviarFactura = async (clienteEmail, filePath, ventaId) => {
  console.log("📩 Iniciando envío de factura...");
  console.log("🔍 Datos recibidos:", { clienteEmail, filePath, ventaId });
  if (!clienteEmail) {
    console.error("❌ No se encontró el correo del cliente.");
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cristianrobertogilcespanta@gmail.com', // Reemplaza con tu email
      pass: 'rmek jkni pbjv runf' // Usa variables de entorno para mayor seguridad
    }
  });
  const mailOptions = {
    from: 'cristianrobertogilcespanta@gmail.com',
    to: clienteEmail, // Se usa el correo del cliente
    subject: `Factura de Compra - Venta #${ventaId}`,
    text: `Adjunto encontrarás la factura de tu compra con ID: ${ventaId}`,
    attachments: [
      {
        filename: `factura_${ventaId}.pdf`,
        path: filePath
      }
    ]
  };
  console.log("📧 Configuración del correo:", mailOptions);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Factura enviada con éxito:", info.response);
    console.log("🗑 Borrando archivo:", filePath);
    fs.unlinkSync(filePath); // Borra el archivo después de enviarlo
  } catch (error) {
    console.error("❌ Error al enviar la factura:", error);
  }
};







// // Obtener una Venta por su id
// const obtenerVentasPorId = async (req, res) => {
//   const { venta_id } = req.params;  // Captura el id de la URL
//   console.log(`Buscando Venta con id: ${venta_id}`);  // Muestra el id que se está buscando en consola

//   try {
//     // Busca la Venta por su id, incluyendo los modelos relacionados (Cliente y Empleado)
//     const venta = await Venta.findOne({
//       where: { venta_id: venta_id },  // Filtro por el id de la Venta
//       include: [
//         {
//           model: Cliente,
//           as: 'cliente',  // Si usas alias, debes agregarlo aquí
//           required: true
//         },
//         {
//           model: Empleado,
//           as: 'empleado',  // Si usas alias, debes agregarlo aquí
//           required: true
//         }
//       ]
//     });

//     // Muestra el resultado de la búsqueda
//     console.log('Venta encontrada:', venta);

//     if (!venta) {
//       // Si no se encuentra la Venta, devuelve un error 404
//       return res.status(404).json({ error: 'Venta no encontrada' });
//     }

//     // Si la Venta es encontrada, se devuelve la Venta
//     return res.status(200).json(venta);
//   } catch (error) {
//     console.error('Error al obtener la Venta:', error);
//     return res.status(500).json({ error: 'Error al obtener la Venta' });
//   }
// };



const obtenerVentasPorId = async (req, res) => {
  try {
    const { venta_id } = req.params; // Obtén el ID de la venta desde los parámetros de la URL

    // Busca la venta por su ID e incluye las relaciones necesarias
    const venta = await Venta.findOne({
      where: { venta_id: venta_id }, // Filtra por el ID de la venta
      include: [
        {
          model: Cliente,
          as: 'cliente', // Usa el alias que definiste en las relaciones
        },
        {
          model: Empleado,
          as: 'empleado', // Usa el alias que definiste en las relaciones
        },
        {
          model: DetalleVenta,
          as: 'detalles', // Usa el alias que definiste en las relaciones
          include: [
            {
              model: Producto,
              as: 'producto', // Usa el alias que definiste en las relaciones
            },
          ],
        },
      ],
    });

    // Si no se encuentra la venta, devuelve un error 404
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Devuelve la venta con todos los detalles
    return res.status(200).json(venta);
  } catch (error) {
    console.error('Error al obtener el detalle de la venta:', error);
    return res.status(500).json({ error: 'Error al obtener el detalle de la venta' });
  }
};




const actualizarVentasPorId = async (req, res) => {
  try {
    const { venta_id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body; // Adapta a tus campos
    console.log('Intentando actualizar Ventas con ID:', venta_id);
    // Busca el Ventas por su ID
    const Ventas = await Venta.findByPk(venta_id);
    if (!Ventas) {
      return res.status(404).json({ error: 'Ventas no encontrado' });
    }
    // Actualiza los campos del Ventas
    await Venta.update({
      nombre,
      descripcion,
      precio,
      stock
    });
    console.log('Ventas actualizado correctamente con ID:', venta_id);
    return res.status(200).json({ message: 'Ventas actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el Ventas:', error);
    console.error('Detalles del error:', error.stack);
    return res.status(500).json({ error: 'Error al actualizar el Ventas' });
  }
};

const eliminarVentasPorId = async (req, res) => {
  try {
    const { venta_id } = req.params;
    console.log('Intentando eliminar Ventas con ID:', venta_id);
    // Elimina el Ventas por su ID
    const VentasEliminado = await Venta.destroy({
      where: { venta_id }
    });
    console.log('Ventas eliminado:', VentasEliminado);
    if (VentasEliminado === 0) {
      console.log('Ventas no encontrado con ID:', venta_id);
      return res.status(404).json({ error: 'Ventas no encontrado' });
    }
    console.log('Ventas eliminado correctamente con ID:', venta_id);
    return res.status(200).json({ message: 'Ventas eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el Ventas:', error);
    console.error('Detalles del error:', error.stack); // Muestra la pila de llamadas completa
    return res.status(500).json({ error: 'Error al eliminar el Ventas' });
  }
};

// eliminar todos los Ventass VALIDO SOLO PARA EL ADMINISTRADOR
const eliminarVentas = async (req, res) => {
  try {
    const Ventas = await Venta.destroy({ truncate: { cascade: true } });// Elimina todos los Ventass de la tabla
    // console.error('resultado obtenidos es ', Ventass);
    return res.status(200).json(Ventas);

  } catch (error) {
    console.error('Error al obtener Ventas:', error);
    return res.status(500).json({ error: 'Error al obtener los Ventass' });
  }
};

module.exports = {
  obtenerVentas,
  obtenerVentasPorId, eliminarVentasPorId, eliminarVentas,
  actualizarVentasPorId, crearVenta
};

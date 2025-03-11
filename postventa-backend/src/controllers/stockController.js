const { Op } = require("sequelize");
const Inventario = require("../models/inventario");
const Producto = require("../models/producto");

const verificarStockBajo = async (req, res) => {
  try {
    const productosBajos = await Inventario.findAll({
      include: [
        {
          model: Producto,
          as: "producto", // Alias debe coincidir con la relación en tu modelo
          attributes: ["nombre", "umbral_stock"],
        },
      ],
      where: {
        cantidad: {
          [Op.lte]: sequelize.col("producto.umbral_stock"), // Comparar con el umbral del producto
        },
      },
    });

    res.json(productosBajos);
  } catch (error) {
    console.error("Error al verificar stock bajo:", error);
    res.status(500).json({ error: "Error al verificar stock bajo" });
  }
};

module.exports = { verificarStockBajo };

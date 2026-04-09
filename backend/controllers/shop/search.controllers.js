
const Product = require("../../models/Product.model");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res.status(400).json({ success: false });
    }

    const products = await Product.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("title price salePrice image")
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

module.exports = { searchProducts };

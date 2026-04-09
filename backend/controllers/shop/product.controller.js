const Product = require("../../models/Product.model.js")


const getFilterProducts = async (req, res) => {
  try {
    const {
      category = "",
      brand = "",
      sortBy = "price-lowtohigh",
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};

    if (category) {
      filters.category = { $in: category.split(",") };
    }

    if (brand) {
      filters.brand = { $in: brand.split(",") };
    }

    // ✅ sorting
    const sortMap = {
      "price-lowtohigh": { price: 1 },
      "price-hightolow": { price: -1 },
      "title-atoz": { title: 1 },
      "title-ztoa": { title: -1 },
      "newest": { createdAt: -1 },
    };

    const sort = sortMap[sortBy] || { price: 1 };

    // ✅ pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filters)
        .select("title price salePrice image category brand")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(), // ⚡ huge boost

      Product.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .lean();

    if (!product) {
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

module.exports = {getFilterProducts, getProductDetails};
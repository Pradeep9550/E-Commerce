const Order = require("../../models/Orders.model")

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({})
      .select("userId totalAmount orderStatus createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.status(200).json({ success: true, data: order });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};

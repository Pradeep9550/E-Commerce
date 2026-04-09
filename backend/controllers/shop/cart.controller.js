const Cart = require("../../models/Cart.model.js");
const Product = require("../../models/Product.model.js");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // ✅ single atomic query (NO loop, NO extra logic)
    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      {
        $inc: { "items.$.quantity": quantity },
      },
      { new: true }
    );

    if (cart) {
      return res.status(200).json({ success: true, data: cart });
    }

    // ✅ if product not exists → push
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      {
        $push: { items: { productId, quantity } },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: updatedCart });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "title price salePrice image",
      })
      .lean(); // ⚡ huge boost

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const items = cart.items
      .filter(i => i.productId)
      .map(i => ({
        productId: i.productId._id,
        title: i.productId.title,
        price: i.productId.price,
        salePrice: i.productId.salePrice,
        image: i.productId.image,
        quantity: i.quantity,
      }));

    return res.status(200).json({
      success: true,
      data: { ...cart, items },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    ).lean();

    if (!cart) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.status(200).json({ success: true, data: cart });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: { items: { productId } },
      },
      { new: true }
    ).lean();

    return res.status(200).json({ success: true, data: cart });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
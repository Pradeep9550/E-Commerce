const paypal = require("../../helpers/paypal")
const Order = require("../../models/Orders.model")
const Cart = require("../../models/Cart.model")
const Product = require("../../models/Product.model");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "https://e-commerce-frontend-xtf6.onrender.com/shop/paypal-return",
        cancel_url: "https://e-commerce-frontend-xtf6.onrender.com/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // 🔒 Step 1: Validate order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔥 Step 2: Prevent duplicate payment
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already captured",
      });
    }

    // 🔒 Step 3: Execute payment (VERIFY FROM PAYPAL)
    const execute_payment_json = {
      payer_id: payerId,
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.error("PayPal Execute Error:", error.response);
          return res.status(500).json({
            success: false,
            message: "Payment verification failed",
          });
        }

        // ✅ Step 4: Verify amount (extra safety)
        const paidAmount =
          payment.transactions[0].amount.total;

        if (parseFloat(paidAmount) !== order.totalAmount) {
          return res.status(400).json({
            success: false,
            message: "Amount mismatch",
          });
        }

        // 🔥 Step 5: Update stock (bulk)
        const bulkOps = order.cartItems.map((item) => ({
          updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { totalStock: -item.quantity } },
          },
        }));

        await Product.bulkWrite(bulkOps);

        // 🧹 Step 6: Clear cart
        await Cart.findByIdAndDelete(order.cartId);

        // ✅ Step 7: Update order
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        await order.save();

        return res.status(200).json({
          success: true,
          message: "Payment successful",
          data: order,
        });
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};



const getAllOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
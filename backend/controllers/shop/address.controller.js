const Address = require("../../models/Address.model.js");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newAddress = await Address.create({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    return res.status(201).json({
      success: true,
      data: newAddress,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id required",
      });
    }

    const addressList = await Address.find({ userId })
      .select("address city pincode phone notes createdAt")
      .lean();

    return res.status(200).json({
      success: true,
      data: addressList,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      req.body,
      {
        new: true,
        lean: true, // ⚡ fast response
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedAddress,
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    }).lean();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
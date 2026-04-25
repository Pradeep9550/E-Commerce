const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/auth.controller.js");

const User = require("../../models/User.model.js"); // ✅ ADD THIS

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
});

module.exports = router;
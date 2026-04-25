const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model.js");

//register
const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    }).lean();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName,
      email,
      password: hashPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

//login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ fast validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ optimized query (only needed fields)
    const user = await User.findOne({ email })
      .select("_id password role email userName")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist!",
      });
    }

    // ✅ password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // ✅ lightweight token (fast)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    // ✅ optimized cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // 🔥 force true
      sameSite: "none", // 🔥 change this
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };

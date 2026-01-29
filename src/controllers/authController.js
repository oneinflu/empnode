const jwt = require("jsonwebtoken");
const SystemUser = require("../models/SystemUser");
const User = require("../models/User");

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not configured");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

async function loginAdmin(req, res) {
  try {
    console.log("Admin login attempt:", req.body.email);
    const { email, password } = req.body;
    const user = await SystemUser.findOne({ email });
    if (!user) {
      console.log("Admin not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      console.log("Invalid password for admin:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Admin logged in successfully:", email);
    const token = signToken({
      sub: user._id.toString(),
      role: user.role,
      kind: "admin",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Admin Error:", err);
    res.status(500).json({ message: "Failed to login admin: " + err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken({
      sub: user._id.toString(),
      type: user.type,
      kind: "user",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatarUrl: user.avatarUrl,
        type: user.type,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to login user" });
  }
}

module.exports = {
  loginAdmin,
  loginUser,
};


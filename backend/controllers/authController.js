const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc    Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // 2. Create user (The password hashing happens in the User Model pre-save hook)
    user = new User({ name, email, password });
    await user.save();

    // 3. Generate Token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Authenticate user & get token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for user
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.log("Login fail: User not found ->", email);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login fail: Password mismatch for ->", email);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 3. Generate Token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get logged in user data
exports.getMe = async (req, res) => {
  try {
    // req.user.id is passed from the authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("GetMe Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

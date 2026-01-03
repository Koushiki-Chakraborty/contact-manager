const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Contact = require("../models/Contact");
const authMiddleware = require("../middleware/auth");

// Create a new contact - POST /api/contacts
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name and phone are required",
      });
    }

    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }
      const existingContact = await Contact.findOne({
        email,
        user: req.user.id,
      });
      if (existingContact) {
        return res.status(400).json({
          success: false,
          error: "Email already exists in your contacts",
        });
      }
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message,
      user: req.user.id,
    });
    await newContact.save();
    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "You already have a contact with this email.",
      });
    }
    console.error("DETAILED ERROR:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

//Get all contacts - GET /api/contacts
router.get("/", async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const contacts = await Contact.find({ user: userId }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(200).json({ success: true, count: 0, data: [] });
  }
});

//  Delete a contact - DELETE /api/contacts/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;

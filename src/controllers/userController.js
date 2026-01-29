const User = require("../models/User");
const cloudinary = require("../cloudinary");

async function createUser(req, res) {
  try {
    const { name, phone, email, password, type } = req.body;

    let avatarUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "users",
      });
      avatarUrl = result.secure_url;
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      type,
      avatarUrl,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatarUrl,
      type: user.type,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
}

async function listUsers(req, res) {
  try {
    const { type } = req.query;
    const query = {};
    if (type) query.type = type;

    const users = await User.find(query).select(
      "_id name phone email avatarUrl type createdAt updatedAt"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to list users" });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      "_id name phone email avatarUrl type createdAt updatedAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
}

async function updateUser(req, res) {
  try {
    const { name, phone, email, password, type } = req.body;
    
    let updateData = { name, phone, email, type };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "users",
      });
      updateData.avatarUrl = result.secure_url;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (type) user.type = type;
    if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;
    if (password) user.password = password;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatarUrl,
      type: user.type,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
}

module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};


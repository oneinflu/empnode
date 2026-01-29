const SystemUser = require("../models/SystemUser");
const cloudinary = require("../cloudinary");

async function createSystemUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    let avatarUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "system_users",
      });
      avatarUrl = result.secure_url;
    }

    const user = await SystemUser.create({
      name,
      email,
      password,
      role,
      avatarUrl,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to create system user" });
  }
}

async function listSystemUsers(req, res) {
  try {
    const users = await SystemUser.find().select(
      "_id name email avatarUrl role createdAt updatedAt"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to list system users" });
  }
}

async function getSystemUser(req, res) {
  try {
    const user = await SystemUser.findById(req.params.id).select(
      "_id name email avatarUrl role createdAt updatedAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
}

async function updateSystemUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    
    let updateData = { name, email, role };
    if (password) {
      // Note: If you just pass password to findByIdAndUpdate, the pre-save hook won't trigger for hashing.
      // We need to retrieve, set, and save for password updates.
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "system_users",
      });
      updateData.avatarUrl = result.secure_url;
    }

    // For simplicity with password hashing, let's find then save
    const user = await SystemUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;
    if (password) user.password = password;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to update user" });
  }
}

async function deleteSystemUser(req, res) {
  try {
    const user = await SystemUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
}

module.exports = {
  createSystemUser,
  listSystemUsers,
  getSystemUser,
  updateSystemUser,
  deleteSystemUser,
};

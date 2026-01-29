const Category = require("../models/Category");

async function createCategory(req, res) {
  try {
    const { name, parentId } = req.body;
    const category = await Category.create({ name, parentId });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to create category" });
  }
}

async function listCategories(req, res) {
  try {
    const categories = await Category.find().populate("parentId", "name");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to list categories" });
  }
}

async function getCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id).populate("parentId", "name");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to get category" });
  }
}

async function updateCategory(req, res) {
  try {
    const { name, parentId } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, parentId },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to update category" });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category" });
  }
}

module.exports = {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};

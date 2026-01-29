const express = require("express");
const { 
  createCategory, 
  listCategories, 
  getCategory, 
  updateCategory, 
  deleteCategory 
} = require("../src/controllers/categoryController");
const { protectSystemUser } = require("../src/middleware/authMiddleware");

const router = express.Router();

router.get("/", listCategories);
router.post("/", protectSystemUser, createCategory);
router.get("/:id", getCategory);
router.put("/:id", protectSystemUser, updateCategory);
router.delete("/:id", protectSystemUser, deleteCategory);

module.exports = router;

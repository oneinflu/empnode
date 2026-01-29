const express = require("express");
const { 
  createSkill, 
  listSkills, 
  getSkill, 
  updateSkill, 
  deleteSkill 
} = require("../src/controllers/skillController");
const { protectSystemUser } = require("../src/middleware/authMiddleware");

const router = express.Router();

router.get("/", listSkills);
router.post("/", protectSystemUser, createSkill);
router.get("/:id", getSkill);
router.put("/:id", protectSystemUser, updateSkill);
router.delete("/:id", protectSystemUser, deleteSkill);

module.exports = router;

const Skill = require("../models/Skill");

async function createSkill(req, res) {
  try {
    const { name, parent } = req.body;
    const skill = await Skill.create({ name, parent });
    const populatedSkill = await skill.populate("parent", "name");
    res.status(201).json(populatedSkill);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Skill already exists" });
    }
    res.status(500).json({ message: "Failed to create skill" });
  }
}

async function listSkills(req, res) {
  try {
    const skills = await Skill.find().sort("name");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Failed to list skills" });
  }
}

async function getSkill(req, res) {
  try {
    const skill = await Skill.findById(req.params.id).populate("parent", "name");
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Failed to get skill" });
  }
}

async function updateSkill(req, res) {
  try {
    const { name } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json(skill);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Skill already exists" });
    }
    res.status(500).json({ message: "Failed to update skill" });
  }
}

async function deleteSkill(req, res) {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete skill" });
  }
}

module.exports = {
  createSkill,
  listSkills,
  getSkill,
  updateSkill,
  deleteSkill,
};

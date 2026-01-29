const express = require("express");
const multer = require("multer");
const { 
  createSystemUser, 
  listSystemUsers, 
  getSystemUser, 
  updateSystemUser, 
  deleteSystemUser 
} = require("../src/controllers/systemUserController");

const router = express.Router();

const upload = multer({ dest: "tmp_uploads/" });

router.get("/", listSystemUsers);
router.post("/", upload.single("avatar"), createSystemUser);
router.get("/:id", getSystemUser);
router.put("/:id", upload.single("avatar"), updateSystemUser);
router.delete("/:id", deleteSystemUser);

module.exports = router;

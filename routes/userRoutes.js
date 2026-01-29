const express = require("express");
const multer = require("multer");
const { 
  createUser, 
  listUsers, 
  getUser, 
  updateUser, 
  deleteUser 
} = require("../src/controllers/userController");

const router = express.Router();

const upload = multer({ dest: "tmp_uploads/" });

router.get("/", listUsers);
router.post("/", upload.single("avatar"), createUser);
router.get("/:id", getUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;


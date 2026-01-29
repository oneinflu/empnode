const mongoose = require("mongoose");
const SystemUser = require("./src/models/SystemUser");
const dotenv = require("dotenv");

dotenv.config();

async function check() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!uri) {
      console.log("No MONGO_URI");
      return;
  }
  await mongoose.connect(uri);
  const users = await SystemUser.find({});
  console.log("System Users found:", users.length);
  users.forEach(u => console.log(`- ${u.email} (${u.role}) Pass: ${u.password.substring(0, 10)}...`));
  
  // Test password for admin@empedia.one
  const admin = users.find(u => u.email === "admin@empedia.one");
  if (admin) {
      const bcrypt = require("bcrypt");
      const isMatch = await bcrypt.compare("12345678", admin.password);
      console.log("Password '12345678' match for admin@empedia.one:", isMatch);
  }
  process.exit(0);
}

check().catch(console.error);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const seedInstructor = require("./src/seedInstructor");

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!uri) {
      console.log("No MONGO_URI");
      return;
  }
  await mongoose.connect(uri);
  console.log("Connected to DB");
  
  await seedInstructor();
  
  console.log("Seeding complete");
  process.exit(0);
}

run().catch(console.error);

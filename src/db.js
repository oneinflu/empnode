const mongoose = require("mongoose");

function getMongoUri() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }
  if (process.env.MONGO_URL) {
    return process.env.MONGO_URL;
  }
  throw new Error("MongoDB connection string not configured");
}

async function connectDb() {
  const uri = getMongoUri();
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

module.exports = connectDb;

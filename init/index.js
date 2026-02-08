const mongoose = require("mongoose");
require('dotenv').config();
const data = require("./data");
const listeningModel = require("../models/listenings");

async function connectDB() {
  try {
    const uri = process.env.ATLASDB_URL;
    if (!uri) throw new Error("ATLASDB_URL is missing in environment variables");

    await mongoose.connect(uri);

    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
connectDB();

const initdb = async() => {
       await listeningModel.deleteMany({});
       data.data = data.data.map((obj) => ({...obj, owner : "6978f9fe2a71061d948b3a97"}));
       await listeningModel.insertMany(data.data);
       console.log("✅ Data inserted successfully");
};
initdb();
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_URI || "mongodb://localhost:27017/ResQPet";

console.log(`🔌 Attempting to connect to MongoDB at: ${url}`);

mongoose.connect(url)
  .then(() => {
    console.log("✅ Database connected successfully to: " + (url.split('/').pop() || 'ResQPet'));
  })
  .catch((err) => {
    console.error("❌ Database connection failed!");
    console.error(`Error: ${err.message}`);
    console.log("👉 Tip: Check if MongoDB is running and your MONGO_URI is correct.");
  });

export default mongoose;
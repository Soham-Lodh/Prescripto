import mongoose from "mongoose";
import { ensureIndexes } from "./indexes.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    await mongoose.connect(`${process.env.MONGO_URI}/prescripto`);

    // Integrity indexes (unique active slot, idempotency TTL). Best effort.
    await ensureIndexes();
  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;

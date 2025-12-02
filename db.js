import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });
};

export default connectDB;
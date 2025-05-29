import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`\nMongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
    
  } catch (error) {
    console.error("MONGODB connection FAILED:", error);
    throw error;
  }
};

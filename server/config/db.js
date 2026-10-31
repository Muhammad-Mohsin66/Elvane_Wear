import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Error: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        process.exit(1);
      }
      console.log(`Retrying MongoDB connection (${retries} retries left)...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect('your-mongodb-uri', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
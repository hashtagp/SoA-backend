import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String, // Store OTP as a string
    required: false, // Optional field
  },
  otpExpiry: {
    type: Date, // Expiry time for OTP
    required: false, // Optional field
  },
  testData: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    chosenAnswer: {
      type: String,
      default: null, // Default is null if the user hasn't answered
    }
  }],
  startTime: {
    type: Date, // Will be set when test starts
  },
  endTime: {
    type: Date, // Will be set when test ends
  },
  currentTime: {
    type: Date,
    default: Date.now, // Defaults to the current time
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

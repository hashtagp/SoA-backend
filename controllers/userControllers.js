import User from "../models/userModel.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../config/emailConfig.js";

dotenv.config();

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered!" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    
    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge:10 * 365 * 24 * 60 * 60 * 1000, //  10 yrs
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Generate Random OTP (6 Digits)
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
      }
  
      // Generate OTP & Set Expiry (5 minutes)
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  
      // Update user with OTP details
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
  
      // Email content
      const mailOptions = {
        from: `"Convocation 2024" ${process.env.EMAIL_USER}`,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: "OTP sent to email!" });
  
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
    }
  };

// Validate OTP and Reset Password
export const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, message: "OTP has expired!" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null; // Clear OTP after password reset
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully!" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
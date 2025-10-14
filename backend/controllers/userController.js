import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    if (!validator.isEmail(email)) {
      return res.send({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.send({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    if (!validator.isStrongPassword(password)) {
      return res.send({
        success: false,
        message: "Password is not strong enough",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.send({ success: false, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { name, email, password: hashedPassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: error.message });
  }
};

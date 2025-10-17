import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.json({
        success: false,
        message: "All fields including image are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const passwordCheck = checkPasswordStrength(password, name, email);
    if (!passwordCheck.valid) {
      return res.json({ success: false, message: passwordCheck.message });
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      stream.end(imageFile.buffer);
    });

    const imageUrl = result.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added" });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.json({
      success: false,
      message: "Server error while adding doctor",
      error: err.message,
    });
  }
};

function checkPasswordStrength(password, name, email) {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!password || password.length < 8)
    return {
      valid: false,
      message: "Password must be at least 8 characters long.",
    };
  if (!specialCharRegex.test(password))
    return {
      valid: false,
      message: "Password must contain at least one special character.",
    };

  const nameParts = name ? name.toLowerCase().split(" ") : [];
  const emailParts = email ? email.toLowerCase().split(/[@._]/) : [];
  const passwordLower = password.toLowerCase();

  for (const part of [...nameParts, ...emailParts]) {
    if (part && part.length >= 3 && passwordLower.includes(part)) {
      return {
        valid: false,
        message: `Password should not contain parts of your name or email: "${part}"`,
      };
    }
  }

  return { valid: true, message: "Password is strong." };
}

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ success: false, message: "Fill all details" });

    if (
      email === process.env.ADMIN_EMAIL?.trim() &&
      password === process.env.ADMIN_PASSWORD?.trim()
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    return res.json({ success: false, message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    return res.json({ success: true, doctors });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
export const appointmentsAdmin=async(req,res)=>{
  try{
    const appointments=await appointmentModel.find({});
    res.json({success:true,appointments});
  }
  catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
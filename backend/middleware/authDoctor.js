import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }
    const tokenDecode = jwt.verify(dtoken, process.env.JWT_SECRET);

    const doctor = await doctorModel.findById(tokenDecode.id).select("_id");
    if (!doctor) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    req.body.docId = doctor._id.toString();
    next();
  } catch (err) {
    console.error("Error in doctor auth:", err);
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export default authDoctor;

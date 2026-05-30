import jwt from "jsonwebtoken";

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
    req.body.docId = tokenDecode.id;
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

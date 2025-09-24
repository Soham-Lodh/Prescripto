import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }
    const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
    const admin = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
    if (tokenDecode != admin) {
      return res.json({
        success: false,
        message: "Invalid token, Not authorized",
      });
    }
    next();
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.json({
      success: false,
      error: err.message,
    });
  }
};

export default authAdmin;

import express from "express";
import {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  adminCancelAppointment
} from "../controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";
import { changeAvailability } from "../controllers/doctorController.js";
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("docImg"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/appointments",authAdmin,appointmentsAdmin);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/admin-cancel-appointment",authAdmin,adminCancelAppointment);
export default adminRouter;

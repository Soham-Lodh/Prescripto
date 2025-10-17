import { doctorsList,loginDoctor } from "../controllers/doctorController.js";
import express from "express";
const doctorRouter = express.Router();
doctorRouter.get("/list", doctorsList);
doctorRouter.post("/login",loginDoctor);
export default doctorRouter;

import { doctorsList } from "../controllers/doctorController.js";
import express from "express";
const doctorRouter = express.Router();
doctorRouter.get("/list", doctorsList);
export default doctorRouter;

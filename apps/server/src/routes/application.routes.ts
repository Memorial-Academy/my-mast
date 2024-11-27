import { Router } from "express";
import * as Controller from "../controllers/application.controller";

const ApplicationRouter = Router();

ApplicationRouter.get("/program/:id", Controller.getProgram)

export default ApplicationRouter;
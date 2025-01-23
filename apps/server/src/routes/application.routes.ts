import { Router } from "express";
import * as Controller from "../controllers/application.controller";

const ApplicationRouter = Router();

ApplicationRouter.get("/program/:id", Controller.getProgram);
ApplicationRouter.get("/programs", Controller.getAllPrograms);

export default ApplicationRouter;
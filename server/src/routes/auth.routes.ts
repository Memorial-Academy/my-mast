import { Router } from "express";
import * as Controller from "../controllers/auth.controller";

export const AuthRouter = Router();

AuthRouter.post("/login", Controller.loginHandler);
AuthRouter.post("/logout", Controller.logoutHandler);
AuthRouter.post("/signup", Controller.signupHandler);
AuthRouter.post("/getsession", Controller.getSession);
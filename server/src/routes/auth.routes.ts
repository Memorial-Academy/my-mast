import { Router } from "express";
import { loginHandler, logoutHandler, signupHandler } from "../controllers/auth.controller";

export const AuthRouter = Router();


AuthRouter.post("/login", loginHandler)
AuthRouter.post("/logout", logoutHandler)
AuthRouter.post("/signup", signupHandler)
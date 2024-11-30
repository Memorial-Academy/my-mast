import { Router } from "express";
import * as Controller from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/login", Controller.loginHandler);
AuthRouter.post("/logout", Controller.logoutHandler);
AuthRouter.post("/signup", Controller.signupHandler);
AuthRouter.post("/getsession", Controller.getSession);
AuthRouter.post("/reset_password", Controller.resetPassword);
AuthRouter.post("/request_reset_password", Controller.initiatePasswordReset);
AuthRouter.post("/admincheck", Controller.adminCheck)
AuthRouter.get("/role/:uuid", Controller.getRole)

export default AuthRouter;
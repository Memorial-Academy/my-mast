import { Request, Response, NextFunction, Router } from "express";
import * as Controller from "../controllers/user.controller";
import validateSession from "../scripts/validate_session";

const UserRouter = Router();

// middleware to ensure valid user session
UserRouter.use("/:role", async (req: Request, res: Response, next: NextFunction) => {
    if (await validateSession(req.body.uuid, req.body.token, req.params.role)) {
        next();
    } else {
        res.writeHead(403);
        res.end();
        return;
    }
})

// API Routes
UserRouter.post("/:role/profile", Controller.profileInfo)

export default UserRouter;
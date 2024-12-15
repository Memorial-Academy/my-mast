import { Request, Response, NextFunction, Router } from "express";
import * as Controller from "../controllers/user.controller";
import validateSession from "../scripts/validate_session";

const UserRouter = Router();

// middleware to ensure valid user session
UserRouter.use("/:role", async (req: Request, res: Response, next: NextFunction) => {
    /* valid values for `:role`:
     * - `parent`
     * - `volunteer`
     * - `student`
     */
    
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
UserRouter.post("/:role/students", Controller.getStudents)      // only for `parent` role
UserRouter.post("/:role/newenrollment", Controller.newEnrollment)     // only for `parent` role

export default UserRouter;
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
        res.writeHead(401);
        res.end("Invalid session or role");
        return;
    }
})

// API Routes
UserRouter.post("/:role/profile", Controller.profileInfo)
UserRouter.post("/:role/students", Controller.getStudents)          // only for `parent` role
UserRouter.post("/:role/newenrollment", Controller.newEnrollment)
UserRouter.post("/:role/assignments", Controller.getAssignments)    // only for `volunteer` role
UserRouter.post("/:role/addstudent", Controller.addstudent)         // only for `parent` role
UserRouter.post("/:role/deletestudent", Controller.deleteStudent)   // only for `parent` role
UserRouter.post("/:role/conflicts", Controller.checkConflicts)
UserRouter.post("/:role/update/profile", Controller.updateProfile)
UserRouter.post("/:role/update/students", Controller.updateStudents)    // only for `parent` role
UserRouter.post("/:role/gethours", Controller.getVolunteeringHours)     // only for `volunteer` role

export default UserRouter;
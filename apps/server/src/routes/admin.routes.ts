import { Request, Response, NextFunction, Router } from "express";
import validateSession, { validateAdmin } from "../scripts/validate_session";
import * as Controller from "../controllers/admin.controller";

const AdminRouter = Router();

// middleware to ensure both a valid user session and that the corresponding user has the admin role
AdminRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    // only volunteers can have admin role
    if (await validateSession(req.body.uuid, req.body.token, "volunteer") && await validateAdmin(req.body.uuid)) {
        next();
    } else {
        res.writeHead(403);
        res.end("Forbidden. Not a valid session or admin");
        return;
    }
})

// Routes
AdminRouter.post("/createprogram", Controller.createProgram);
AdminRouter.post("/managedprograms", Controller.getManagedPrograms);
AdminRouter.post("/getuser", Controller.getUser);
AdminRouter.post("/enrollments/students", Controller.getStudentEnrollments);
AdminRouter.post("/enrollments/volunteers", Controller.getVolunteerSignups);
AdminRouter.post("/confirmvolunteer", Controller.confirmVolunteerAssignment);

export default AdminRouter;
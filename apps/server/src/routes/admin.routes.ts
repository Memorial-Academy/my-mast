import { Request, Response, NextFunction, Router } from "express";
import validateSession, { validateAdmin } from "../scripts/validate_session";
import * as Controller from "../controllers/admin.controller";

const AdminRouter = Router();

// middleware to ensure both a valid user session and that the corresponding user has the admin role
AdminRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    // only volunteers can have admin role
    const adminLevel = await validateAdmin(req.body.uuid);
    if (await validateSession(req.body.uuid, req.body.token, "volunteer") && adminLevel > 0) {
        res.locals.adminLevel = adminLevel;
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
AdminRouter.post("/getuserbyemail", Controller.getUserByEmail);
AdminRouter.post("/addadmin", Controller.addProgramAdmin);

export default AdminRouter;
import { Request, Response, NextFunction, Router } from "express";
import validateSession, { validateAdmin } from "../scripts/validate_session";
import * as Controller from "../controllers/admin.controller";
import Program from "../models/application/program.model";
import VolunteerUser from "../models/users/volunteer.model";
import { validateData } from "../scripts/input_validation";

const AdminRouter = Router();

// middleware to ensure both a valid user session and that the corresponding user has the admin role
AdminRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    // only volunteers can have admin role
    const adminLevel = await validateAdmin(req.body.uuid);
    if (await validateSession(req.body.uuid, req.body.token, "volunteer") && adminLevel > 0) {
        res.locals.adminLevel = adminLevel;
        next();
    } else {
        res.writeHead(401, {
            "content-type": "text/plain"
        });
        res.end("Forbidden. Not a valid session or admin");
        return;
    }
})

// middleware to ensure both a valid volunteer user and program exist (mainly for /attendance/volunteer endpoints)
AdminRouter.use("/attendance/volunteer", async (req: Request, res: Response, next: NextFunction) => {
    // ensure the program and volunteer exist
    let program = await Program.findOne({id: validateData(req.body.program, res)});
    let volunteer = await VolunteerUser.findOne({uuid: validateData(req.body.volunteer, res)});
    if (!program || !volunteer) {
        res.writeHead(404, {
            "content-type": "text/plain"
        })
        res.end(`Could not find "${!program ? `program ${req.body.program}` : `volunteer ${req.body.volunteer}`}".`)
        return;
    // check if the volunteer is enrolled in the program or not
    } else if (!program.enrollments.volunteers.find((elem) => {
        return elem.indexOf(volunteer.uuid) != -1;
    })) {
        res.writeHead(403, {
            "content-type": "text/plain"
        })
        res.end(`Volunteer "${req.body.volunteer}" is not enrolled in program "${req.body.program}".`);
        return;
    } else {
        res.locals.program = program;
        res.locals.volunteer = volunteer;
        next();
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
AdminRouter.post("/unenroll/student", Controller.unenrollStudent_Admin);
AdminRouter.post("/unenroll/volunteer", Controller.unenrollVolunteer_Admin);
AdminRouter.post("/allowenrollments", Controller.toggleNewEnrollments);
AdminRouter.post("/attendance/volunteer/checkinstatus", Controller.volunteerCheckInStatus);
AdminRouter.post("/attendance/volunteer/checkin", Controller.checkInVolunteer);
AdminRouter.post("/attendance/volunteer/checkout", Controller.checkOutVolunteer);
AdminRouter.post("/attendance/volunteer/addhours", Controller.addVolunteerHours);
AdminRouter.post("/attendance/volunteer/gethours", Controller.viewVolunteerHours);
AdminRouter.post("/attendance/volunteer/deletehours", Controller.deleteVolunteeringSession);

export default AdminRouter;
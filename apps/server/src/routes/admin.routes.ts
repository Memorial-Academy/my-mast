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
        res.end();
        return;
    }
})

// Routes
AdminRouter.post("/createprogram", Controller.createProgram);

export default AdminRouter;
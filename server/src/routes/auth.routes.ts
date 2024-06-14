import { Router } from "express";

export const AuthRouter = Router();

// POST /api
AuthRouter.post("/login", (req, res) => {
    console.log(req.body);
    res.end();
})
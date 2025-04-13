import { Response } from "express";

export const PERMISSIONS = {
    NONE: 0,
    SUPER: 1,       // no limitations
    DIRECTOR: 2,    // can add and manage programs
    ADMIN: 3,       // can only manage programs they are added to
}

export function permissionCheck(res: Response, requiredLevel: number) {
    if (res.locals.adminLevel <= 0) {
        res.writeHead(403);
        res.end();
        return false;
    };

    if (res.locals.adminLevel <= requiredLevel) return true;
    else {
        res.writeHead(403);
        res.end();
        return false;
    };
}
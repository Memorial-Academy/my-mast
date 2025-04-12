import { headers } from "next/headers"

export const PERMISSIONS = {
    NONE: 0,
    SUPER: 1,       // no limitations
    DIRECTOR: 2,    // can add and manage programs
    ADMIN: 3,       // can only manage programs they are added to
}

export function hasPermssion(requiredPermissionLevel: number) {
    let adminLevel = parseInt(headers().get("X-AdminLevel") || "0");

    if (adminLevel <= 0) return false;

    if (adminLevel <= requiredPermissionLevel) {
        return true;
    } else return false;
}
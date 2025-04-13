import sessionInfo from "@mymast/utils/authorize_session";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        if (request.cookies.has("id")) {
            let sessionCookie = (await sessionInfo())!;
            let session = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/getsession`, {
                method: "POST",
                body: sessionCookie.token // token
            });
            let adminCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admincheck`, {
                method: "POST",
                body: JSON.stringify({
                    uuid: sessionCookie.uuid,
                    token: sessionCookie.token
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (session.status == 200 && adminCheck.status == 200) {
                const headers = new Headers(request.headers);
                headers.set("X-AdminLevel", await adminCheck.text());
                return NextResponse.next({request: {
                    headers: headers
                }});
            } else {
                throw "Invalid session or admin credentials";
            }
        } else {
            throw "No session cookie";
        }
    } catch(e) {
        return NextResponse.redirect(new URL("/403", request.url));
    }
}

export const config = {
    matcher: ["/((?!403|_next|favicon.ico|seal.svg).*)"]
}
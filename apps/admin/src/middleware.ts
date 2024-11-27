import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        if(request.cookies.has("id")) {
            let sessionCookie = JSON.parse(request.cookies.get("id")!.value);
            let session = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/getsession`, {
                method: "POST",
                body: sessionCookie[0] // token
            });
            let adminCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admincheck`, {
                method: "POST",
                body: sessionCookie[1] // uuid
            });
            // console.log(session.status, adminCheck.status);

            if (session.status == 200 && adminCheck.status == 200) {
                return NextResponse.next();
            } else {
                throw "Invalid session or admin credentials";
            }
        } else {
            throw "No session cookie";
        }
    } catch(e) {
        return NextResponse.redirect(new URL("/403", request.url), {
            // headers: {
            //     "Set-Cookie": "id=null; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            // }
        });
    }
}

export const config = {
    matcher: ["/((?!403|_next|favicon.ico|seal.svg).*)"]
}
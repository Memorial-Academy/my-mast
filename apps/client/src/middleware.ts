import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        if(request.cookies.has("id")) {
            let sessionCookie = JSON.parse(request.cookies.get("id")!.value);
            let session = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/getsession`, {
                method: "POST",
                body: sessionCookie[0]
            })

            if (session.status == 200) {
                const headers = new Headers(request.headers);
                headers.set("X-UserRole", (await session.json()).role);
                return NextResponse.next({
                    request: {headers}
                });
            } else {
                throw "Invalid session";
            }
        } else {
            throw "No session cookie";
        }
    } catch(e) {
        return NextResponse.redirect(new URL("/", request.url), {
            headers: {
                "Set-Cookie": "id=null; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }
        });
    }
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ]
}
import { cookies } from "next/headers";

export default async function sessionInfo() {
    const cookieStore = cookies();

    if (cookieStore.has("id")) {
        let sessionCookie = JSON.parse(cookieStore.get("id")!.value)

        let session = {
            uuid: sessionCookie[1],
            token: sessionCookie[0]
        }

        return session;
    } else {
        return;
    }
}
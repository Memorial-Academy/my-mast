"use server";

export async function sendPasswordResetEmail(email: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request_reset_password`, {
        method: "POST",
        body: email
    })
}

export async function submitNewPassword(password: string, token: string) {
    var res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset_password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password,
            token: token 
        })
    })
    return res.status;
}
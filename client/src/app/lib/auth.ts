"use server"

function POSTData(data: FormData, endpoint: string) {
    return fetch(process.env.NEXT_PUBLIC_API_URL + endpoint, {
        method: "POST",
        body: data
    })
}

export async function loginUser(data: FormData) {
    POSTData(data, "/auth/login");
}

export async function signupUser(data: FormData) {
    POSTData(data, "/auth/signup");
}
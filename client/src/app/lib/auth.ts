"use server"

export async function loginUser(data: FormData) {
    console.log(data);

    fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
        method: "POST",
        body: data
    })
}

export async function signupUser(data: FormData) {
    
}
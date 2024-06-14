"use client";
import ProtectedInput from "./ProtectedInput";
import LoginButton from "./LoginButton";

export default function LoginForm() {
    async function submitForm(data: FormData) {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
            method: "POST",
            body: data
        })
    }

    return (
        <form action={submitForm}>
          <input type="email" name="email" placeholder="Email" required />
          <ProtectedInput placeholder="Password" name="password" />
          <LoginButton />
        </form>
      )
}
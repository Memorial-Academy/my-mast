import { Metadata } from "next";
import "@/styles/auth.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | MyMAST",
};

export default function Home() {
  if (cookies().has("id")) {
    redirect("/dashboard");
  }

  return (
    <>
      <div id="auth">
        <img alt="MAST seal" src="/seal.svg" />
        <h1>Welcome to MyMAST</h1>
        <p>Login to continue</p>
        <LoginForm />
      </div>
    </>
  );
}

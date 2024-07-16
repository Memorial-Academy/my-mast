import { Metadata } from "next";
import "@/styles/auth.css";
import { loginUser } from "@/app/lib/auth";
import LabelledInput from "@/components/LabelledInputs";
import LoginButton from "@/components/auth/LoginButton";

export const metadata: Metadata = {
  title: "Login | MyMAST",
};

export default function Home() {
  return (
    <>
      <div id="auth">
        <img alt="MAST seal" src="/seal.svg" />
        <h1>Welcome to MyMAST</h1>
        <p>Login to continue</p>
        <form action={loginUser}>

          <LabelledInput
            question="Email"
            name="email"
            placeholder="Email"
            required
          />
          <LabelledInput
            question="Password"
            name="password"
            placeholder="Password"
            required
            protected
          />
          <LoginButton text="Login" />
        </form>
      </div>
    </>
  );
}



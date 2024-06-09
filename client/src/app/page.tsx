import { Metadata } from "next";
import LoginButton from "@/components/LoginButton";
import "@/styles/auth.css";
import ProtectedInput from "@/components/ProtectedInput";

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

        <form>
          <input type="email" name="email" placeholder="Email" required />
          <ProtectedInput placeholder="Password" />
          <LoginButton />
        </form>
      </div>
    </>
  );
}



import { Metadata } from "next";
import { LoginButton } from "@/components/LoginButton";

export const metadata: Metadata = {
  title: ""
}

export default function Home() {
  return (
    <>
      <div id="auth">
        <h1>Welcome to MyMAST</h1>
        <p>Login to continue</p>

        <form>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <LoginButton />
        </form>
      </div>
    </>
  );
}



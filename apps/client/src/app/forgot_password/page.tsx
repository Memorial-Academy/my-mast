import { Metadata } from "next";
import "@/styles/auth.css";
import { NewPassword, RequestPasswordReset } from "@/components/auth/ResetPassword";

export const metadata: Metadata = {
    title: "Reset Password | MyMAST"
}

export default function Page({searchParams}: {searchParams: {t: string} | undefined}) {
    var token = searchParams ? searchParams.t : "";
    
    return (
        <>
            <div id="auth">
                <h1>Reset your MyMAST password</h1>
                {!token && <RequestPasswordReset />}
                {token && <NewPassword token={token} />}
            </div>
        </>
    )
}
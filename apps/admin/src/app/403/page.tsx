import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unauthorized | Admin Control Panel | MyMAST"
}

export default function Page() {
    return (
        <main>
            <h1>Unauthorized</h1>
            <p><b>You do not have the correct permissions to access this website.</b> Please ensure you are logged into the correct account on MyMAST; the Admin Control Panel authenticates users via MyMAST login sessions.</p>
            <h2>Looking for MyMAST?</h2>
            <p>This is the admininstrative control panel for MyMAST. Only specific members of the MAST team are able to access this website. If you're a parent, volunteer, or student, make sure you're logging into the regular MyMAST website.</p>
            <br/>
            <p>
                <a href={process.env.NEXT_PUBLIC_MYMAST_URL}>Click here</a> to return to MyMAST.
                <br/>
                <a href="/">Click here</a> to attempt to reload the Admin Panel.
            </p>
        </main>
    )
}
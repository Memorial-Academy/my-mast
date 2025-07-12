import API from "@/app/lib/APIHandler";
import VirtualProgramRedirect from "@/components/VirtualProgramRedirect";
import sessionInfo from "@mymast/utils/authorize_session";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
    const program = await API.Application.getProgram((await params).id);
    return {
        title: `Join Virtual Program - ${program.name} | MyMAST`
    }
}

const messages = [
    "Let's go!",
    "Beaming you up...",
    "Houston, we have lift off!",
    "Engaging the hyperdrive...",
    "Enjoy your journey through the interwebs!",
    "If you're reading this, hi from the developer of MyMAST! (also you're smart)".split("").map(val => {
        return val.charCodeAt(0).toString(2) + " ";
    }).join(""),
    "We're on it! Our highly trained penguins are connecting you to your program!",
    "Beep boop your wish to learn is my command!",
    "Wanna see something cool? Well I'm taking you there now!"
]

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const program = await API.Application.getProgram((await params).id);
    const session = (await sessionInfo())!;

    if (program.location.loc_type == "virtual") {
        if (program.location.link) {
            return (
                <>
                    <h2>{messages[Math.round(Math.random() * (messages.length - 1))]}</h2>
                    <p>
                        We're about to automatically redirect you to the virtual classroom for {program.name}. If your browser doesn't automatically redirect you in a few seconds, please click this link:&nbsp;
                        <VirtualProgramRedirect link={program.location.link}/>
                    </p>
                    <p>Now have fun, learn cool things, and make awesome creations!</p>
                </>
            )
        } else {
            return (
                <>
                    <h2>You're here early!</h2>
                    <p>
                        There's still some time before {program.name} begins. Once it gets closer to the first day of your enrollment, visit this link again, and we'll send you over to the virtual classroom!
                        <br/>
                        For now, you can head back to your <Link href="/dashboard">dashboard by clicking here</Link>.
                    </p>
                    <p>
                        <b>Looking for a Zoom/Google Meet link?</b>
                        <br/>
                        This page is a replacement for that link! This page is a permanent link, which means you can bookmark/save this page (or access it at any time from your MyMAST dashboard) and it will always automatically take you to your program's virtual classroom.
                        <br/>
                        Don't worry about keeping track of different virtual classroom links; just save this page or access it from your dashboard, and let MyMAST manage all the virtual classroom links for you!
                    </p>
                </>
            )
        }
    } else {
        return (
            <>
                <h2>Well this is awkward...</h2>
                <p>The program you're trying to join is not a virtual program. Make sure the link you've visited is correct and for a program taking place at a virtual location. <Link href="/dashboard">Click here</Link> to go back to your MyMAST dashboard.</p>
            </>
        )
    }
}
import * as CreateProgramHelp from "@/components/CreateProgramHelp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help Guide - Create New Program | Admin Control Panel | Memorial Academy of Science and Technology"
}

export default function Page() {
    return (
        <main>
            <h2>Add a new program - Help Guide</h2>
            <section id="intro">
                <p>
                    Hooray! The time has come to create a program for MAST! This guide will help explain how to add a program to MyMAST, allowing for parents and volunteers to begin signing up!
                </p>
                <p>
                    This process is intended to be simple. You should only have to enter this information once, and MyMAST will continuously work behind the scenes to automatically take care of all the mundane logistical stuff (managing signups, maintaining student/volunteer info, sending confirmation emails, attendance and hours tracking, etc.). This guide will walk you through all the different sections of the program creation form, and also define what each piece of information means!
                </p>
                <p>
                    <b>Please note:</b> only designated people are allowed to access and use MyMAST's Admin Panel to manage and create specific programs as outline in the Program Director Agreement (or other governing document; for the purposes of this guide all documents authorizing program creation will be referred to as the Program Director Agreement). Providing unauthorized access to the Admin Panel will be considered a breach of the Program Director Agreement.
                </p>
            </section>
            <CreateProgramHelp.GeneralInformation />
            <CreateProgramHelp.LocationInfo />
            <CreateProgramHelp.ContactInfo />
            <CreateProgramHelp.ScheduleInfo />
            <CreateProgramHelp.CoursesInfo />
            <CreateProgramHelp.FinalReview />
        </main>
    )
}

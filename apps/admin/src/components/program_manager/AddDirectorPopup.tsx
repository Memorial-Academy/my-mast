"use client";
import { LabelledInput, Popup } from "@mymast/ui";
import { useState } from "react";
import { searchForVolunteer, SearchForVolunteerReturn } from "@/app/lib/add_admin";
import calculateAge from "@mymast/utils/birthday";

type AddDirectorProps = {
    programName: string,
    programID: string
}

export default function AddDirectorPopup({programName, programID}: AddDirectorProps) {
    const [popupActive, setPopupActive] = useState(false);
    const [user, setUser] = useState<SearchForVolunteerReturn>();

    return (
        <>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setPopupActive(true);
                }}
            >+ Add directors</a>

            <Popup
                active={popupActive}
                onClose={() => {setPopupActive(false)}}
            >
                <h2>Add a director to {programName}</h2>
                
                <form
                    action={async (data: FormData) => {
                        let email = data.get("email")!.toString();
                        let profile = await searchForVolunteer(email, programID);
                        setUser(profile);
                    }}
                >
                    <LabelledInput
                        question="Email address:"
                        placeholder="volunteer@memorialacademy.org"
                        required
                        name="email"
                        type="email"
                    />
                    <input type="submit" value="Submit" />
                </form>

                {user == 404 ? 
                    <p>No user found. Please try a different email address and ensure it is correctly typed.</p>
                : user == 409 ? 
                    <p>This user is already a director for this program!</p>
                : user && <>
                    <h3>Please confirm!</h3>
                    <p>
                        You are about to add <b>{user.name.first} {user.name.last}</b> as a Program Director for <b>{programName}</b>.
                        <br/>
                        They will have full access to all information, enrollments, and settings for this program.
                    </p>
                    <p>
                        <b>Please confirm the following information matches what you expected for this person:</b>
                        <br/>
                        Name: {user.name.first} {user.name.last}
                        <br/>
                        Email: {user.email}
                        <br/>
                        Phone: {user.phone}
                        <br/>
                        Birthday: {calculateAge(user.birthday).birthdayString}
                        <br/>
                        Attending school: {user.school}
                    </p>

                    <input 
                        type="button"
                        value="Confirm"
                        onClick={() => {
                            setPopupActive(false);
                            window.location.reload();
                        }}
                    />
                </>}
            </Popup>
        </>
    )
}
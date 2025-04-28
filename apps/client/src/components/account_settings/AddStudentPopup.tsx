"use client";
import API from "@/app/lib/APIHandler";
import { LabelledInput, Popup } from "@mymast/ui";
import { useState } from "react";

export default function AddStudent({uuid, token}: {uuid: string, token: string}) {
    const [active, setActive] = useState(false);

    return (
        <>
            <button 
                type="button" 
                title="Add student"
                onClick={() => {
                    setActive(true)
                }}
            >
                Add a student
            </button>
            <Popup
                active={active}
                onClose={() => {
                    setActive(false)
                }}
            >
                <h3>Add a student</h3>
                <form action={async (data: FormData) => {
                    console.log(data.get("bithday"))
                    await API.User.addStudent(uuid, token, {
                        first_name: data.get("first_name")!.toString(),
                        last_name: data.get("last_name")!.toString(),
                        birthday: data.get("birthday")!.toString(),
                        notes: data.get("notes")?.toString() || "",
                    })
                    window.location.reload();
                }}>
                    <div className="bi-fold">
                        <div>
                            <LabelledInput
                                question="First name"
                                placeholder="First name"
                                name="first_name"
                                type="text"
                                required
                            />
                            <LabelledInput
                                question="Last name"
                                placeholder="Last name"
                                name="last_name"
                                type="text"
                                required
                            />
                        </div>
                        <div>
                            <LabelledInput
                                question="Date of birth"
                                name="birthday"
                                type="date"
                                required
                            />
                            <LabelledInput
                                question="Additional information"
                                placeholder="Notes (not required)"
                                name="notes"
                                type="text"
                            />
                        </div>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </Popup>
        </>
    )
}
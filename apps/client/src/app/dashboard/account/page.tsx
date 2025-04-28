import API from "@/app/lib/APIHandler";
import { updateProfileFormHandler, updateStudentsFormHandler } from "@/app/lib/update_accounts";
import AddStudent from "@/components/account_settings/add_student_popup";
import { Session, UserTypes, UserTypesString } from "@mymast/api/Types";
import { LabelledInput, Card, ConfirmationPopup } from "@mymast/ui";
import sessionInfo from "@mymast/utils/authorize_session";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: "My Account | MyMAST"
}

export default async function Page() {
    let session = (await sessionInfo())!;
    // let role: UserTypesString = await API.Auth.getRole(session.uuid, session.token);
    let role: UserTypesString = headers().get("X-UserRole") as UserTypesString;
    let profile = await API.User.profile(role, session.uuid, session.token);

    return (
        <>
            <h2>My Account</h2>
            {/* <p>Account type: {role}</p> */}
            <form 
                className="edit-account"
                action={async (data: FormData) => {
                    "use server";
                    await updateProfileFormHandler(data, session, role);
                }}
            >
                <h3>Personal Information</h3>
                <LabelledInput
                    question="First name"
                    defaultValue={profile.name.first}
                    name="first_name"
                    type="text"
                    placeholder={profile.name.first}
                />
                <LabelledInput
                    question="Last name"
                    defaultValue={profile.name.last}
                    name="last_name"
                    type="text"
                    placeholder={profile.name.last}
                />
                <h3>Contact Information</h3>
                <LabelledInput
                    question="Email"
                    defaultValue={profile.email}
                    name="email"
                    type="email"
                    placeholder={profile.email}
                />
                <LabelledInput
                    question="Phone"
                    defaultValue={profile.phone}
                    name="phone"
                    type="phone"
                    placeholder={profile.phone}
                />
                {role == "parent" && <ParentSpecificSettings profile={profile as UserTypes.Parent} />}
                {role == "volunteer" && <VolunteerSpecificSettings profile={profile as UserTypes.Volunteer} />}
                <br/>
                <input type="submit" value={"Save account information"}/>
            </form>
            {role == "parent" && <ManageStudents session={session} />}
        </>
    )
}

function VolunteerSpecificSettings({profile}: {profile: UserTypes.Volunteer}) {
    return (
        <>
            <h3>Volunteer Information</h3>
            <LabelledInput
                question="School"
                defaultValue={profile.school}
                name="school"
                type="text"
                placeholder={profile.school}
            />
        </>
    )
}

async function ParentSpecificSettings({profile}: {profile: UserTypes.Parent}) {
    return (
        <>
            <h3>Emergency Contact</h3>
            <p>The same emergency contact is used for all of your students. Updating your emergency contact information here will automatically update it on all enrollments for your students.</p>
            <LabelledInput
                question="First name"
                defaultValue={profile.emergencyContact.name.first}
                name="emergency_first_name"
                type="text"
                placeholder={profile.emergencyContact.name.first}
            />
            <LabelledInput
                question="Last name"
                defaultValue={profile.emergencyContact.name.last}
                name="emergency_last_name"
                type="text"
                placeholder={profile.emergencyContact.name.last}
            />
            <LabelledInput
                question="Email"
                defaultValue={profile.emergencyContact.email}
                name="emergency_email"
                type="email"
                placeholder={profile.emergencyContact.email}
            />
            <LabelledInput
                question="Phone"
                defaultValue={profile.emergencyContact.phone}
                name="emergency_phone"
                type="phone"
                placeholder={profile.emergencyContact.phone}
            />
        </>
    )
}

type ManageStudentProfilesProps = {
    // profile: UserTypes.Parent,
    session: Session
}

async function ManageStudents({session}: ManageStudentProfilesProps) {
    let students = await API.User.parentGetStudents(session.uuid, session.token);

    return (
        <>
            <h3>Your Students</h3>
            <p>Changes made here will automatically be updated across all enrollments.</p>
            <form action={async (data: FormData) => {
                "use server";
                let ids = students.map(student => {
                    return student.uuid;
                })
                await updateStudentsFormHandler(data, session, ids)
            }}>
                <div className="tri-fold">
                    {students.map(student => {
                        return (
                            <Card
                                header={`${student.name.first} ${student.name.last}`}
                                key={student.uuid}
                            >
                                <LabelledInput
                                    question="First name"
                                    defaultValue={student.name.first}
                                    name={`${student.uuid}_first_name`}
                                    type="text"
                                    placeholder={student.name.first}
                                />
                                <LabelledInput
                                    question="Last name"
                                    defaultValue={student.name.last}
                                    name={`${student.uuid}_last_name`}
                                    type="text"
                                    placeholder={student.name.last}
                                />
                                <LabelledInput
                                    question="Date of birth"
                                    defaultValue={`${student.birthday.year}-${leadingZero(student.birthday.month)}-${leadingZero(student.birthday.day)}`}
                                    name={`${student.uuid}_birthday`}
                                    type="date"
                                />
                                <LabelledInput
                                    question="Notes"
                                    defaultValue={student.notes}
                                    name={`${student.uuid}_notes`}
                                    type="text"
                                />
                                <ConfirmationPopup
                                    buttonText="Remove student"
                                    message={`You are about to delete ${student.name.first} ${student.name.last} from MyMAST. This will unenroll them from all programs they are currently enrolled in and completely remove their data from MyMAST. This action is permanent. Are you sure you want to continue?`}
                                    callback={async () => {
                                        "use server";
                                        console.log("deleting " + student.name.first + " " + student.name.last);
                                        await API.User.deleteStudent(session.uuid, session.token, student.uuid);
                                    }}
                                    reload
                                />
                            </Card>
                        )
                    })}
                </div>
                <input type="submit" value={"Save student information"}/>
            </form>
            <AddStudent 
                uuid={session.uuid}
                token={session.token}
            />
        </>
    )
}

function leadingZero(num: number) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num.toString();
    }
}
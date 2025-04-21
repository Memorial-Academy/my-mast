import API from "@/app/lib/APIHandler";
import AddStudent from "@/components/account_settings/add_student_popup";
import { UserTypes, UserTypesString } from "@mymast/api/Types";
import { LabelledInput, Card, ConfirmationPopup } from "@mymast/ui";
import sessionInfo from "@mymast/utils/authorize_session";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Account | MyMAST"
}

export default async function Page() {
    let session = (await sessionInfo())!;
    let role: UserTypesString = await API.Auth.getRole(session.uuid, session.token);

    let profile = await API.User.profile(role, session.uuid, session.token);

    return (
        <>
            <h2>My Account</h2>
            <p>Account type: {role}</p>
            <form className="edit-account">
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
                {role == "volunteer" && <VolunteerSpecificSettings profile={profile as UserTypes.Volunteer} />}
            </form>
            {role == "parent" && <ParentSpecificSettings profile={profile as UserTypes.Parent} session={session} />}
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

type ParentSpecificSettings = {
    profile: UserTypes.Parent,
    session: {
        uuid: string,
        token: string
    }
}

async function ParentSpecificSettings({profile, session}: ParentSpecificSettings) {
    let students = await API.User.parentGetStudents(session.uuid, session.token);

    return (
        <>
            <h3>Your Students</h3>
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
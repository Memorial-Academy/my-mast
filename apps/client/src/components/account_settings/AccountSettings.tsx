"use client";
import { Session, UserTypes, UserTypesString, FullName, Birthday } from "@mymast/api/Types";
import AddStudent from "@/components/account_settings/AddStudentPopup";
import { updateProfileFormHandler, updateStudentsFormHandler } from "@/app/lib/update_accounts";
import { LabelledInput, Card, ConfirmationPopup } from "@mymast/ui";
import API from "@/app/lib/APIHandler";
import { leadingZero } from "@mymast/utils/string_helpers";

type AccountSettingsFormProps = {
    session: Session,
    role: UserTypesString,
    profile: {
        // parent
        name: FullName,
        email: string,
        phone: string,
        linkedStudents: string[]    
    } | {
        // volunteer
        name: FullName,
        email: string,
        phone: string,
        birthday: Birthday
    }
}

export default function AccountSettingsForm({session, role, profile}: AccountSettingsFormProps) {
    return (
        <form 
            className="edit-account"
            action={async (data: FormData) => {
                await updateProfileFormHandler(data, session, role);
                alert("Your account has been updated!");
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
            <p><b>Please note:</b> changing your email address here will change the email address you use to login and the email address used to contact you.</p>
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
            <LabelledInput
                question="Notes, additional info, etc."
                defaultValue={profile.skills}
                name="skills"
                type="text"
                placeholder={profile.skills}
            />
        </>
    )
}

function ParentSpecificSettings({profile}: {profile: UserTypes.Parent}) {
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
    session: Session,
    students: UserTypes.Student[]
}

export function ManageStudents({session, students}: ManageStudentProfilesProps) {
    return (
        <>
            <h3>Your Students</h3>
            <p>Changes made here will automatically be updated across all enrollments.</p>
            <form action={async (data: FormData) => {
                let ids = students.map(student => {
                    return student.uuid;
                })
                await updateStudentsFormHandler(data, session, ids)
                alert("Your account has been updated!");
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


import { FullName, Session, UserTypesString } from "@mymast/api/Types";
import API from "./APIHandler";

function getFormData(data: FormData, key: string) {
    return data.get(key)!.toString();
}

export async function updateProfileFormHandler(data: FormData, auth: Session, role: UserTypesString) {
    if (role == "volunteer") {
        return await API.User.updateVolunteerProfile(
            auth.uuid,
            auth.token,
            {
                first: getFormData(data, "first_name"),
                last: getFormData(data, "last_name")
            },
            getFormData(data, "email"),
            getFormData(data, "phone"),
            getFormData(data, "school"),
            getFormData(data, "skills")
        )
    } else if (role == "parent") {
        return await API.User.updateParentProfile(
            auth.uuid,
            auth.token,
            {
                first: getFormData(data, "first_name"),
                last: getFormData(data, "last_name")
            },
            getFormData(data, "email"),
            getFormData(data, "phone"),
            {
                name: {
                    first: getFormData(data, "emergency_first_name"),
                    last: getFormData(data, "emergency_last_name")
                },
                email: getFormData(data, "emergency_email"),
                phone: getFormData(data, "emergency_phone"),
            }
        )
    }
}

export async function updateStudentsFormHandler(data: FormData, auth: Session, studentIDs: string[]) {
    let students = new Array<{
        uuid: string,
        name: FullName,
        birthday: string,
        notes: string
    }>();

    for (var id of studentIDs) {
        students.push({
            uuid: id,
            name: {
                first: getFormData(data, `${id}_first_name`),
                last: getFormData(data, `${id}_last_name`)
            },
            birthday: getFormData(data, `${id}_birthday`),
            notes: getFormData(data, `${id}_notes`)
        })
    }
    
    return await API.User.updateStudents(
        auth.uuid,
        auth.token,
        students
    );
}
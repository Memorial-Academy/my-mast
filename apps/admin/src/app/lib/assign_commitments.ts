"use server";
import { VolunteeringCommitment } from "@mymast/api/Types";
import API from "./APIHandler";
import sessionInfo from "@mymast/utils/authorize_session";

export default async function submitVolunteerAssignments(
    data: FormData, 
    programID: string, 
    volunteerID: string,
    enrollmentID: string,
    additionalInformation?: string
) {
    let assignments: Array<VolunteeringCommitment> = [];

    // calculate total number of commitments by week
    let totalWeeks = 0;

    for (let key of Array.from(data.keys())) {
        totalWeeks += key.indexOf("assignment") > -1 ? 1 : 0;
    }

    // process each commitment by week
    for (var i = 1; i <= totalWeeks; i++) {
        assignments.push({
            week: i,
            course: parseInt( data.get(`assignment_week${i}`)!.toString() ),
            instructor: (data.get(`instructor_week${i}`)?.toString ? true : false)
        })
    }

    let auth = await sessionInfo();

    API.Admin.confirmVolunteer(
        auth!.uuid,
        auth!.token,
        volunteerID,
        programID,
        assignments,
        enrollmentID,
        additionalInformation
    )
}
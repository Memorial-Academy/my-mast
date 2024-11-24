"use client";
import CreateWeeklySchedule from "@/components/CreateWeeklySchedule";
import { LabelledInput } from "@mymast/ui";
import { FormEvent, useState } from "react";

type Schedule = {
    dayCount: number,
    date: string,
    start: number,
    end: number
}

type ProgramData = {
    name: string,
    location: {
        common_name: string,
        address: string,
        city: string,
        state: string,
        zip: string
    },
    schedule: Array<Array<Schedule>>
}

function getFormData(data: FormData, key: string) {
    return data.get(key)?.toString();
}

export default function CreateProgramForm() {
    const [programData, setProgramData] = useState<ProgramData>();

    function generateData(e: FormEvent<HTMLFormElement>) {
        let formData = new FormData(e.currentTarget);
        
        let data: ProgramData = {
            name: getFormData(formData, "name")!,
            location: {
                common_name: getFormData(formData, "location_common")!,
                address: getFormData(formData, "location_address")!,
                city: getFormData(formData, "location_city")!,
                state: getFormData(formData, "location_state")!,
                zip: getFormData(formData, "location_zip")!
            },
            schedule: new Array<Array<Schedule>>
        }

        // Find all the schedule information in form data by iterating through weeks and days per week
        let weekExists = true;
        let weekIndex = 1;
        while(weekExists) {
            // Make sure 
            if (!formData.get(`week${weekIndex}_day1_date`)) {
                weekExists = false;
                break;
            }

            let week = [];

            let dayExists = true;
            let dayIndex = 1;
            while(dayExists) {
                if (!formData.get(`week${weekIndex}_day${dayIndex}_date`)) {
                    dayExists = false;
                    break;
                }

                week.push({
                    dayCount: dayIndex,
                    date: getFormData(formData, `week${weekIndex}_day${dayIndex}_date`)!,
                    start: parseFloat(getFormData(formData, `week${weekIndex}_day${dayIndex}_start`)!),
                    end: parseFloat(getFormData(formData, `week${weekIndex}_day${dayIndex}_end`)!),
                })

                dayIndex++;
            }
            data.schedule.push(week)
            weekIndex++;
        }

        setProgramData(data);
        // console.log(data);
    }

    return (
        <form onChange={generateData}>
            <h3>General Information</h3>
            <LabelledInput
                question="Program Name"
                name="name"
                type="text"
                placeholder="Name"
                required
            />

            <h3>Location</h3>
            <LabelledInput
                question="Common Name"
                name="location_common"
                type="text"
                placeholder="Ex: Stratford High School"
                required
            />
            <LabelledInput
                question="Street Address"
                name="location_address"
                type="text"
                placeholder="Address"
                required
            />
            <div className="tri-fold">
                <LabelledInput
                    question="City"
                    name="location_city"
                    type="text"
                    placeholder="City"
                    required
                />
                <LabelledInput
                    question="State"
                    name="location_state"
                    type="text"
                    placeholder="State"
                    required
                />
                <LabelledInput
                    question="ZIP Code"
                    name="location_zip"
                    type="text"
                    placeholder="ZIP"
                    required
                />
            </div>

            <h3>Schedule</h3>
            <CreateWeeklySchedule/>
        </form>
    )
}
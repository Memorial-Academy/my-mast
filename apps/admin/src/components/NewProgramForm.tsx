"use client";
import CreateWeeklySchedule from "@/components/CreateWeeklySchedule";
import { LabelledInput } from "@mymast/ui";
import { MultipleChoice } from "@mymast/ui"
import { FormEvent, useState } from "react";
import CreateCourse from "./CreateCourse";

// types inherited from @/index.d.ts

function getFormData(data: FormData, key: string) {
    return data.get(key)?.toString();
}

export default function CreateProgramForm() {
    const [programData, setProgramData] = useState<ProgramData>();
    const [locationType, setLocationType] = useState("");
    const [page, setPage] = useState(1);

    function generateData(e: FormEvent<HTMLFormElement>) {
        let formData = new FormData(e.currentTarget);
        
        let locationData;
        let locationTypeFormData = getFormData(formData, "location_type")
        if (locationTypeFormData == "virtual") {
            setLocationType("virtual");
            locationData = {
                type: "virtual"
            };
        } else if (locationTypeFormData == "in-person") {
            setLocationType("physical");
            locationData = {
                type: "physical",
                common_name: getFormData(formData, "location_common")!,
                address: getFormData(formData, "location_address")!,
                city: getFormData(formData, "location_city")!,
                state: getFormData(formData, "location_state")!,
                zip: getFormData(formData, "location_zip")!
            };
        } else {
            locationData = {
                type: ""
            }
        }

        let data: ProgramData = {
            name: getFormData(formData, "name")!,
            location: locationData,
            schedule: new Array<Array<Schedule>>,
            courses: new Array<Course>,
            contact: {
                name: {
                    first: getFormData(formData, "contact_first_name")!,
                    last: getFormData(formData, "contact_last_name")!
                },
                email: getFormData(formData, "contact_email")!,
                phone: getFormData(formData, "contact_phone")!
            }
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

        let courseExists = true;
        let courseIndex = 1;
        while (courseExists) {
            if (!formData.get(`course${courseIndex}_name`)) {
                courseExists = false;
                break;
            }

            data.courses.push({
                name: getFormData(formData, `course${courseIndex}_name`)!,
                duration: parseInt(getFormData(formData, `course${courseIndex}_duration`)!),
                available: formData.getAll("course1_enrollment_options").map(val => {return parseInt(val.toString().split("week ")[1])})
            })

            courseIndex++;
        }

        setProgramData(data);
        console.log(data);
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
            <MultipleChoice
                name="location_type"
                type="radio"
                required
                values={["Virtual", "In-person"]}
                question="In-person or Virtual?"
            />
            {/* In-person ("physical") location */}
            {locationType == "physical" ? <>
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
            </> : (
                /* Virtual ("virtual") location */
               locationType == "virtual" ? <p>Location will be displayed as "Virtual." Remember to send out meeting links at a later date!</p> : <></> 
            )}

            <h3>Contact Information</h3>
            <p>Primary contact only</p>
            <div className="bi-fold">
                <LabelledInput
                    question="First Name"
                    type="text"
                    placeholder="First Name"
                    name="contact_first_name"
                    required
                />
                <LabelledInput
                    question="Last Name"
                    type="text"
                    placeholder="Last Name"
                    name="contact_last_name"
                    required
                />
            </div>
            <div className="bi-fold">
                <LabelledInput
                    question="Email"
                    type="email"
                    placeholder="Email Address"
                    name="contact_email"
                    required
                />
                <LabelledInput
                    type="phone"
                    question="Phone Number"
                    name="contact_phone"
                />
            </div>
            
            <h3>Schedule</h3>
            <CreateWeeklySchedule/>

            {page > 1 ? <>
                <h3>Courses</h3>
                <p>Using a single curriculum? Create one course and provide it any name; the system will automatically select that course during enrollment.</p>
                <p>Note: "Enrollment available" determines the start date of the course. For example: setting a course with a 2 week duration to have enrollment available during weeks 1 and 2 would mean session 1 would occur during weeks 1 and 2, while session 2 would occur weeks 2 and 3.</p>
                <CreateCourse schedule={programData!.schedule} />
            </> : <></>}

            {page < 3 ? <>
                <br/>
                <p>Click continue to load the next section of this form.</p>
                <input 
                    type="button"
                    value="Continue" 
                    onClick={() => {
                        if (page == 1 && programData && programData.schedule) {
                            setPage(2);
                        } else if (page == 2) {
                            setPage(3);
                        } else {
                            alert("Please complete the current section");
                        }
                    }}
                />
            </> : <></>}

            {page == 3 ? <>
                <hr/>
                <h2>Preview your program!</h2>
                <p><b>Make sure all the details are correct!</b> If they are, click submit.</p>

            </> : <></>}
        </form>
    )
}
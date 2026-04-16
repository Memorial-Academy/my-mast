import { EmailLink } from "@mymast/ui"
import MYMAST_URL from "@mymast/utils/urls"

export function GeneralInformation() {
    return <section id="general-info">
        <h3>General Information</h3>
        <p>
            <b>"Program Name":</b> this is the official name of the program, as specified in the Program Director Agreement. This will be publicly displayed and cannot be changed.
        </p>
    </section>
}

export function LocationInfo() {
    return <section id="location-info">
        <h3>Location Information</h3>
        <p>
            <b>"In-person or virtual?":</b> this will determine the type of location the program occurs at: an in-person/physical location, or in a virtual classroom. Different information will be required depending on the location type chosen. This cannot be changed.
        </p>
        <h4>Virtual</h4>
        <p>
            No further information is required during program creation for a virtual program.
        </p>
        <p>
            <b>A note on MyMAST Virtual Classroom Links</b>
            <br/>
            Virtual classroom links often change, or aren't available until very close to the date of the camp. To avoid confusion or communication issues, MyMAST will automatically create a Virtual Classroom Link when a virtual program is created. This link will look like "{MYMAST_URL.CLIENT}/virtual_program/&lt;program ID&gt;" and will be available to parents and volunteers the second they sign up.
            <br/>
            This link is used to redirect volunteers and parents/students to the correct virtual classroom. In the "Information" tab of Program Manager for a given program, admins will be able to change the "Internal virtual classroom link" (a.k.a the "redirect link"); this is the link that the MyMAST Virtual Classroom Link will redirect users to. It can be changed at any time, as many times as needed, and the redirect will be immediately updated for all users. 
        </p>
        <p>Good to knows & limitations:</p>
        <ul>
            <li>Please only share the MyMAST Virtual Classroom Link to parents and volunteers. Do not share any links directly to a Zoom/Webex/Google Meet/etc. session.</li>
            <li>If no redirect link is set, anyone accessing the link will see a message saying "you're here early" and informing them of the link's purpose.</li>
            <li>For security purposes, parents and volunteers must be logged into their MyMAST account or the link will redirect them to the login page first. Students may login with their parent's account (there is no limitation to the number of active login sessions).</li>
            <li>MyMAST does <ins>not</ins> check the contents of the webpage/website being redirected to; it only checks that the link is a valid link. Please ensure the proper link is being entered into MyMAST.</li>
        </ul>
        <h4>In-person</h4>
        <p>In-person programs will be required to provide the following information:</p>
        <ul>
            <li>
                <b>"Common Name":</b> the common/conversational name for the location (ex: the name of a park/school/church, like "Memorial Park")
            </li>
            <li>
                <b>"Street address":</b> the official street address of the location
            </li>
            <li>
                <b>"City"</b>/<b>"State"</b>/<b>"ZIP Code"</b>: mostly self-explanatory; no real preference is given as to whether the state is abbreviated or fully typed out. Please ensure the ZIP code is just the 5-digit ZIP code and not a full ZIP+4.
            </li>
        </ul>
    </section>
}

export function ContactInfo() {
    return <section id="contact-info">
        <h3>Contact Information</h3>
        <p>
            Please only provide the contact information for the main person responsible for managing communications. Shared email addresses/phone numbers are allowed. This person must be someone who has signed a Program Director Agreement.
            <br/>
            <b>Note:</b> this information will be publicly viewable on the program signup page (to anyone interested in signing-up for the program) and displayed to all parents/volunteers after signup.
        </p>
        <p>
            <b>"First name"</b> & <b>"Last name"</b>: self-explanatory; first and last name for the main contact.
        </p>
        <p>
            <b>"Email":</b> whatever email is best for parents and volunteers to communicate with.
            <br/>
            <ins>All MAST Program Directors are elgible to receive a free MAST Mail (and MAST Cloud) account!</ins> Contact <EmailLink email="it@memorialacademy.org"/> to claim your's if you haven't already!
            <br/>
            If applicable, alias email addresses can also be requested for an entire program (for example: stempark.springbranch@memorialacademy.org) that will forward a single email to all program directors of the program. 
        </p>
        <p>
            <b>"Phone number":</b> this is optional but encouraged. Only U.S phone numbers are accepted. This phone number must accept calls, texts, and voicemails.
        </p>
    </section>
}

export function ScheduleInfo() {
    return <section id="schedule-info">
        <h3>Schedule Information</h3>
        <p>This part will likely take the longest. Please manually add as many weeks as are needed for the program, then for each week add as many days are necessary. For each day, select the start and end time. A week and corresponding days (and times) must be added for every single week instruction for a program occurs. The schedule applies to the entire program and cannot be adjusted for individual courses (see next section).</p>
        <p><b>Please note:</b> to provide flexibility in scheduling methods, MyMAST does not enforce many rules in the creation of a schedule. Please ensure all dates, times, number of weeks, and number of days per week matches the planned schedule before creating the program.</p>
        <p>Click "Continue" when you're done entering this information to load the next set of questions; while you can edit your answers to these questions, MyMAST must have answers to all of these questions to determine what questions to ask next.</p>
    </section>
}

export function CoursesInfo() {
    return <section id="course-info">
        <h3>Course Information</h3>
        <p>
            <b>How many courses do I need?</b>
            <br/>
            Some progarms have a single curriculum (such as STEMpark). These programs will have only one course; therefore program directors should go through the following steps to create a single course.
            <br/>
            Other programs have many curriculums (such as Let's Code with "Introduction to Web Development," "Introduction to Python," etc.). These programs will need a course for each of these curriculums.
        </p>
        <p>
            <b>"Course name":</b> the official name of the course.
            <br/>
            <ins>For single curriculum programs:</ins> this should simply match the name of the program in some way (such as "STEMpark &lt;year&gt;" for a program with the STEMpark curriculum).
            <br/>
            <ins>For multi-curriculum programs:</ins> the course name should match the name of the curriculum being taught in that course.
        </p>
        <p>
            <b>"Course length":</b> this controls how long the course will last for. "Weeks" refers to the weeks you created in the "Schedule" section of this form. Defaults to week.
        </p>
        <p>
            <b>"Enrollment available during...":</b> when will the <ins>first day(s)</ins> of this program take place (select all that apply, defaults to none). The weeks available to select are determined by the weeks created in the "Schedule" section and by the program length. If a program with a four-week schedule has a two-week long course, a first day of the course could occur during weeks one, two, and three. To allow signups in week four, a fifth week would have to be added.
        </p>
        <p>Add as many courses as are needed and add information for each of them. Click "Continue" when you're done to begin the final review.</p>
    </section>
}

export function FinalReview() {
    return <section id="review">
        <h3>Final review!</h3>
        <p>
            <b>Once created, it can be difficult to change details of a program, and doing so can cause confusion for parents and volunteers.</b>
            Before submitting, please take a few minutes to scroll through and make sure every single detail of the program has been correctly into the form. Check the spelling of everything, ensure the right boxes are selected and checked, make sure the right dates and times are selected.
        </p>
        <p>When you're certain everything is perfect, click "Submit." One final confirmation will appear, click "OK" on that to submit the form. MyMAST will process all that information and create all the necessary signup pages (and a virtual classroom link if needed). You'll be redirected to the Program Manager for the program upon its creation, where you'll be able to view all necessary information, copy/share signup links, and manage signups!</p>
    </section>
}
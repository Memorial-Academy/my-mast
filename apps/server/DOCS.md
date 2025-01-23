# MyMAST API Documentation
This documentation serves as a basic overview of the various endpoints provided by this API.
Note this API is intended for internal use, not public use.

## `/auth`
Routes used for user authentication and authorization.

### `/auth/login`
Handles user login.

**Method:** `POST`

**Request:**
```javascript
{
    email: string,
    password: string
}
```

**Response:**
```javascript
/* Status code 200 */
{
    sessionToken: string,
    sessionExpiry: number,  // Unix timestamp
    uuid: string
}
```

### `/auth/logout`
Handles user logout.

**Method:** `POST`

**Request:**
```
<session_token>
```

**Response:**
```javascript
/* Status code 200 */
```

### `/auth/signup`
Handles signup of new users.

**Method:** `POST`

**Request:**
```javascript
{
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,   // only accepted in format "(xxx) xxx-xxxx"
    role: "parent" | "volunteer"
    agreement: boolean,     // agreement to Privacy Policy and Terms of Service,
    birthday?: string       // formatted as YYYY-MM-DD

    // for parent accounts only
    // students have an indefinite number. This number will be represented in form fields as [i]
    student[i]_first_name: string
    student[i]_last_name: string
    student[i]_birthday: string // YYYY-MM-DD
    student[i]_additional_info: string
    [...]
}
```

**Response:**
```javascript
/* Status code 200 */
{
    sessionToken: string,
    sessionExpiry: number,  // Unix timestamp
    uuid: string
}
```
```javascript
/* Status code 500 */
<error message>
```

### `/auth/getsession`
Provides basic session information to ensure user is logged in with a valid session.

**Method:** `POST`

**Request:**
```
<session token>
```

**Response:**
```javascript
/* Status code 200 */
{
    uuid: string,
    role: "parent" | "volunteer" | "student"
}
```
```javascript
/* Status code 404 */
```

### `/auth/reset_password`
Replaces an existing users password provided a reset request has already been made (see below).

**Method:** `POST`

**Request:**
```javascript
{
    token: string,      // password reset token, automatically included by unique password reset page
    password: string,   // new password
}
```

**Response:**
```javascript
/* Status code 200 */
```
```javascript
/* Status code 403 */
```

### `/auth/request_reset_password`
Requests a password reset for a user given the email address and initiates the password reset process (including sending a unique link).

**Method:** `POST`

**Request:**
```
<user email>
```

**Response:**
N/A

### `/auth/admincheck`
Returns 200 if a UUID is linked to a user with administrator permissions, returns 404 if they are not.

**Method:** `POST`

**Request:**
```javascript
{
    uuid: string,   // user's UUID
    token: string   // valid session token
}
```

**Response:**
```javascript
/* Status code 200 */
```
```javascript
/* Status code 403 */
```
```javascript
/* Status code 404 */
```

### `/auth/role`
Returns the role of the provided UUID

**Method:** `POST`

**Request:**<br>
```javascript
{
    uuid: string,   // user's UUID
    token: string   // valid session token
}
```

**Response:**
```
<role>
```
```javascript
/* Status code 403 */
```

## `/user/<role>`
`<role>` can be equal to `volunteer` or `parent`. Responses may differ slightly based on role, differences will be noted.<br>
*A valid session token for the user is required to use endpoints on this route.* The server will authorize all requests by ensuring the session token is authorized to access information on that user.<br>
All requests will have the basic structure of 
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // endpoint specific data (if necessary)
}
```
to ensure successful user authentication.

### `/user/<role>/profile`
Returns functionally-important information related to the user.

**Method:** `POST`

**Request**
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // no endpoint specific data
}
```

**Response**<br>
`<role> == "volunteer"`
```javascript
{
    name: {
        first: string,
        last: string
    },
    email: string,
    phone: string,
    birthday: {
        month: number,
        day: number,
        year: number
    }
}
```
`<role> == "parent"`
```javascript
{
    name: {
        first: string,
        last: string
    },
    email: string,
    phone: string,
    linkedStudents: string[]    // Array of UUID's for the corresponding students linked to the parent account
}
```

### `/user/parent/students`
This endpoint is only available to users with the `role` of `parent`.<br>
Returns the information for all the students linked to that parent account.

**Method:** `POST`

**Request**
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // no endpoint specific data
}
```

**Respoonse**
```javascript
/* Status code 200 */
{
    name: {
        first: string,
        last: string
    },
    notes: string | null,
    uuid: string,
    birthday: {
        day: number,
        year: number,
        month: number
    },
    linkedParent: string,
    enrollments: string[]   // array of program IDs
}[]
```
``` javascript
/* Status code 404 */
```

### `/user/<role>/newenrollment`
`parent`: Allows an authorized parent to add enrollments to any linked students.
`volunteer`: Allows an authorized volunteer to signup for a new program

**Method:** `POST`

**Request**
`<role> == "parent"`
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    program: string // program ID
    data: {
        id: string  // student's UUID
        course: number  // course ID
        week: number    // week of attendance
    }[]
}
```
`<role> == "volunteer"`
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    program: string // program ID
    data: {
        weeks: number[],    // weeks volunteer is signing up for
        courses: number[],  // course IDs volunteer is interested in
        instructor: boolean,    // does the volunteer want to be an instructor
        skills: string  // skills volunteer wishes to share
    }
}
```

**Respoonse**
```javascript
/* Status code 200 */
```
``` javascript
/* Status code 403 */
```
``` javascript
/* Status code 404 */
```

## `/admin`
Allows modification/creation of programs and management of the rest of MyMAST's information.<br>
Like the `/user/<role>` route, all requests to `/admin` will have the basic structure of
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // endpoint specific data (if necessary)
}
```
to ensure successful user authentication.

### `/admin/createprogram`
Allows admins to create new programs to be published to MyMAST.

**Method:** `POST`

**Request**
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    data: {
        name: string,
        location: {
            type: "virtual" | "physical"

            // only present if type == "physical"
            common_name?: string,
            address?: string,
            city?: string,
            state?: string,
            zip?: string
        },
        schedule: {
            dayCount: number,
            date: number,
            month: number,
            year: number,
            start: number,
            end: number
        }[][],
        courses: {
            name: string,
            duration: number    // Duration in number of weeks
            available: Array<number>    // Weeks during which a new sessions begin (students are able to enroll)
        }[],
        contact: {
            name: {
                first: string,
                last: string
            },
            phone: string,
            email: string
        }
    }
}
```

**Response**
```javascript
/* Status code 200 */
<program id>
```

```javascript
/* Status code 403 */
```

```javascript
/* Status code 400 */
```

### `/admin/managedprograms`
Returns the programs an admin is allowed to view/edit in the Admin Control Panel.

**Method**: `POST`

**Request:**
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // No endpoint specific data
}
```

**Response:**
```javascript
{
    id: string
    name: string,
    volunteering_hours: {
        total: number,
        weekly: number
    }
    location: {
        loc_type: "virtual" | "physical"

        // only present if loc_type == "physical"
        common_name?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string

        // only present if loc_type == "virtual"
        link?: string
    },
    schedule: {
        dayCount: number,
        date: number,
        month: number,
        year: number,
        start: number,
        end: number
    }[][],
    courses: {
        id: number  // index of the course
        name: string,
        duration: number    // Duration in number of weeks
        available: Array<number>    // Weeks during which a new sessions begin (students are able to enroll)
    }[],
    contact: {
        name: {
            first: string,
            last: string
        },
        phone: string,
        email: string
    },
    admins: string[],   // Array of UUIDs that are authorized to view/edit the program in MyMAST admin control panel
    enrollments: {
        volunteers: string[],   // enrollment IDs for volunteers
        students: string[]  // enrollment IDs for students
    }
}
```

### `/admin/getuser`
Allows an admin user to see information about another user. This is essentially a version of `/user/<role>/profile that can be accessed by any admin user, for a user of any given role.

**Method**: `POST`

**Request:**
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // Endpoint specific
    requested_uuid: string 
}
```

**Response:**
If the user's role is "`volunteer`"
```javascript
{
    role: "volunteer",
    profile: {
        name: {
            first: string,
            last: string
        },
        email: string,
        phone: string,
        birthday: {
            month: number,
            day: number,
            year: number
        }
    }
}
```
If the user's role is "`parent`"
```javascript
{
    role: "parent",
    profile: {
        name: {
            first: string,
            last: string
        },
        email: string,
        phone: string,
        linkedStudents: string[]    // Array of UUID's for the corresponding students linked to the parent account
    }
}
```

### `/admin/enrollments/students`
Allows an admin user to see student enrollments for a program.

**Method**: `POST`

**Request:**
```javascript
{
    token: string,  // User's session token
    uuid: string    // User's UUID
    // Endpoint specific
    program: string // program ID
}
```

**Response:**
```javascript
// The returned object is an array. Each item in the array represents a course for the program
{
    courseID: number,   // ID for the course
    total: number,  // total enrollments in the course
    data: { // array of all weeks
        week: number    // week number for the listed enrollments
        enrollments: {  // array of all enrollments for that week, in student & parent pairs
            student: {
                name: {
                    first: string,
                    last: string
                },
                uuid: string,
                birthday: {
                    day: number,
                    month: number,
                    year: number
                },
                notes?: string, // additional information provided by parent
                linkedParent: string    // parent's UUID
            },
            parent: {
                name: {
                    first: string,
                    last: string
                },
                email: string,
                phone: string,
            }
        }[]
    }[]
}[]
```

## `/app`
These are paths used by the application to retrieve/manage information related to the app's core functionality.

### `/app/getprogram/<program_id>`
Returns all information for the provided program ID.

**Method:** `GET`

**Request:**<br>
See URL

**Response:**
```javascript
/* Status code 200 */
{
    id: string,
    name: string,
    program_type: "stempark" | "letscode",
    location: {
        loc_type: "virtual" | "physical"

        // only present if type == "physical"
        common_name?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string
    },
    schedule: {
        dayCount: number,
        date: number,
        month: number,
        year: number,
        start: number,
        end: number
    }[][],
    courses: {
        name: string,
        duration: number    // Duration in number of weeks
        available: Array<number>    // Weeks during which a new sessions begin (students are able to enroll)
    }[],
    contact: {
        name: {
            first: string,
            last: string
        },
        phone: string,
        email: string
    },
    volunteering_hours: {
        total: number,
        weekly: number[]
    }
}
```
```javascript
/* Status code 404 */
```

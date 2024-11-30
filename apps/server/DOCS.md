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
```
<uuid>
```

**Response:**
```javascript
/* Status code 200 */
```
```javascript
/* Status code 404 */
```

### `/auth/role/<uuid>`
Returns the role of the provided UUID

**Method:** `GET`

**Request:**<br>
See URL

**Response:**
```
<role>
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
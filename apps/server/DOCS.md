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
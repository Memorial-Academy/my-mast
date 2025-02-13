declare namespace Auth {
    function login(
        email: string,
        password: string
    ): {
        sessionToken: string,
        sessionExpiry: number,  // Unix timestamp
        uuid: string
    }
}
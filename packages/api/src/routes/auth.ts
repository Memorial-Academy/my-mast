import { Fetch } from "../fetcher";

export class Auth {
    private url = "https://localhost:5000"
    
    constructor(APIUrl: string) {
        this.url = APIUrl
    }

    async login(email: string, password: string) {
        let data: {
            sessionToken: string,
            sessionExpiry: number,  // Unix timestamp
            uuid: string
        } | FetchError = await Fetch.postJSON(this.url, "auth/login", {
            email: email,
            password: password
        })

        return data;
    }
}
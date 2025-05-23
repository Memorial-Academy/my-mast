import { UserTypesString } from "../../types";
import * as Fetch from "../fetcher";

export default class Auth {
    private url = "https://localhost:5000"
    
    constructor(APIUrl: string) {
        this.url = APIUrl
    }

    // /auth/login (POST)
    async login(email: string, password: string) {
        let data: {
            sessionToken: string,
            sessionExpiry: number,  // Unix timestamp
            uuid: string
        } = await Fetch.POST.json(this.url, "login", {
            email: email,
            password: password
        })

        return data;
    }

    // /auth/logout
    async logout(token: string)  {
        let req: null = await Fetch.POST.text(this.url, "logout", token);
        return req;
    }

    // /auth/signup
    async signup() {

    }

    // /auth/getsession
    async getSession(token: string) {
        let sessionData: {
            uuid: string,
            role: "parent" | "volunteer" | "student"
        } = await Fetch.POST.text(this.url, "getsession", token);
        return sessionData;
    }

    async getRole(
        uuid: string,
        token: string
    ): Promise<UserTypesString> {
        return await Fetch.POST.json(this.url, "role", {
            uuid: uuid,
            token: token
        })
    }
}
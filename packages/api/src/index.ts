import { Auth } from "./routes/auth";

export class APIHandler {
    readonly Auth: Auth;

    constructor(APIUrl: string) {
        this.Auth= new Auth(APIUrl);
    }
}
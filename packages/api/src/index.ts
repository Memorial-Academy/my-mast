import Auth from "./routes/auth";
import User from "./routes/user";
import Application from "./routes/application";

export default class APIHandler {
    readonly Auth: Auth;
    readonly User: User;
    readonly Application: Application;

    constructor(APIUrl: string) {
        this.Auth = new Auth(APIUrl);
        this.User = new User(APIUrl);
        this.Application = new Application(APIUrl);
    }
}
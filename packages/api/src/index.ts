import Auth from "./routes/auth";
import User from "./routes/user";
import Application from "./routes/application";
import Admin from "./routes/admin";

export default class APIHandler {
    readonly Auth: Auth;
    readonly User: User;
    readonly Application: Application;
    readonly Admin: Admin;

    constructor(APIUrl: string) {
        this.Auth = new Auth(APIUrl + "/auth");
        this.User = new User(APIUrl + "/user");
        this.Application = new Application(APIUrl + "/app");
        this.Admin = new Admin(APIUrl + "/admin");
    }
}
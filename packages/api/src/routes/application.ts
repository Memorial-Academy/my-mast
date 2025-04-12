import { Program } from "../../types/application";
import * as Fetch from "../fetcher";

export default class Application {
    private url = "https://localhost:5000";
    
    constructor(APIUrl: string) {
        this.url = APIUrl;
    }
    
    // /app/program/<program_id>
    async getProgram(id: string): Promise<Program> {
        return await Fetch.GET.json(this.url, "program", id);
    }
    
    // /app/programs
    async getAllPrograms(): Promise<Program[]> {
        return await Fetch.GET.json(this.url, "programs");
    }
}
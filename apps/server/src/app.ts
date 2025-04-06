import Express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import BodyParser from "body-parser";

require("dotenv").config();

const app = Express();

// Middleware
app.use(CookieParser());
const upload = multer();
app.use(upload.none());
app.use(BodyParser.text());
app.use(BodyParser.json());

app.use(cors());

// Routing
import AuthRouter from "./routes/auth.routes";
import UserRouter from "./routes/user.routes";
import AdminRouter from "./routes/admin.routes";
import ApplicationRouter from "./routes/application.routes";
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/admin", AdminRouter);
app.use("/app", ApplicationRouter);

app.get("/", (req,res) => {
    res.writeHead(200);
    res.end("MyMAST API is running on " + process.env.PORT);
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});
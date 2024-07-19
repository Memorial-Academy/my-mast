import Express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
// import { connect as ConnectDatabase } from "./db" ;

require("dotenv").config();

const app = Express();

// Middleware
app.use(CookieParser());
const upload = multer();
app.use(upload.none())

app.use(cors());


// Routing
import { AuthRouter } from "./routes/auth.routes";
app.use("/auth", AuthRouter);

app.get("/", (req,res) => {
    res.end("MyMAST API is running on " + process.env.PORT);
})

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});
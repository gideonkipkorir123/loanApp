import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import deserializeUser from "./middleware/deserializeUser";
import router from "./routers/index";
dotenv.config();

const port = process.env.ENV_VARIABLE;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);
app.use(express.urlencoded({ extended: false }));

app.use(router)
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "";
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

app.listen(port, () => {
    connectDB();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
module.exports = app;

// const getUser = async()=>{
//     const createdUser = await createUser({phoneNumber: '0715134415', fullName: "Dennis", password: "123456", email: "dennocapi@gmail.com"})
//     const user = await getUserById("65c8bb07a613ffe08d373e4c")
//     return user
// }

// getUser()
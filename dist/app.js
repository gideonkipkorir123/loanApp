"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const index_1 = __importDefault(require("./routers/index"));
dotenv_1.default.config();
const port = process.env.ENV_VARIABLE;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(deserializeUser_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Hello there , This is my homepage!');
});
app.use(index_1.default);
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "";
        await mongoose_1.default.connect(uri);
        console.log("MongoDB connected successfully!");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
app.listen(port, () => {
    connectDB();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
module.exports = app;
// const sendMail = async()=>{
//     const email = await getUserByPhoneNumber(`+254710246806`)
//     return email
// }
// sendMail()

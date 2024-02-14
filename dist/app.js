"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// const deserializeUser = require("./middleware/deserializeUser");
const index_1 = __importDefault(require("./routers/index"));
dotenv_1.default.config();
const port = process.env.ENV_VARIABLE;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(index_1.default);
app.use((0, cookie_parser_1.default)());
// app.use(deserializeUser);
app.use(express_1.default.urlencoded({ extended: false }));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = process.env.MONGO_URI || "";
        yield mongoose_1.default.connect(uri);
        console.log("MongoDB connected successfully!");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
});
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

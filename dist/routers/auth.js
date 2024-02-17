"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const user_2 = require("../controllers/user");
const db_1 = require("../db");
const requireUser_1 = require("../middleware/requireUser");
const password_1 = require("../controllers/password");
const authRouter = express_1.default.Router();
authRouter.post("/register", user_2.createUserController);
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email incorrect or in the wrong format" });
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Wrong Password!" });
        }
        const session = (0, db_1.createSession)({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        });
        const accessToken = (0, jwt_1.signJWT)({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            sessionId: session.sessionId,
        }, "1d");
        const refreshToken = (0, jwt_1.signJWT)({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            sessionId: session.sessionId,
        }, "30d");
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        res.json({ accessToken, refreshToken, session });
    }
    catch (error) {
        console.log(error);
    }
});
authRouter.post("/logout", (req, res) => {
    try {
        // Clear both "accessToken" and "refreshToken" cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logout successful" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// update logged in user password
authRouter.post("/updatePassword", requireUser_1.requireUser, (0, requireUser_1.authRole)(requireUser_1.ROLES.user), password_1.updateLoggedInUserPassword);
// when user clicks forgot email
authRouter.post("/forgotPassword", password_1.requestPasswordResetByEmail);
// reset updated email in database
authRouter.post("/resetPassword", password_1.resetUserPasswordByEmail);
// verify if tokens are valid
authRouter.post("/verifyToken", password_1.verifyToken);
// SEND OTP VIA PHONENUMBER
authRouter.post("/phoneNumber", password_1.requestPasswordResetViaOTP);
exports.default = authRouter;

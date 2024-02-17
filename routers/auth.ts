import express from "express";
import { Request, Response } from "express";
import { signJWT } from '../utils/jwt'
import bcrypt from "bcrypt";
import User from "../models/user";
import { createUserController } from "../controllers/user";
import { createSession } from "../db";
import { ROLES, authRole, requireUser } from "../middleware/requireUser";
import { requestPasswordResetByEmail, requestPasswordResetViaOTP, resetUserPasswordByEmail, updateLoggedInUserPassword, verifyToken } from "../controllers/password";
import { createOTPController, verifyOTPByPhoneNumberController } from "../controllers/OTP";



const authRouter = express.Router();

authRouter.post("/register", createUserController);

authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email incorrect or in the wrong format" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Wrong Password!" });
        }

        const session = createSession({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        });

        const accessToken = signJWT(
            {
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                sessionId: session.sessionId,
            },
            "1d",
        );

        const refreshToken = signJWT(
            {
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                sessionId: session.sessionId,
            },
            "30d"
        );

        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        res.json({ accessToken, refreshToken, session });
    } catch (error) {
        console.log(error);
    }
});

authRouter.post("/logout", (req: Request, res: Response) => {
    try {
        // Clear both "accessToken" and "refreshToken" cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// update logged in user password
authRouter.post("/updatePassword", requireUser, authRole(ROLES.user), updateLoggedInUserPassword)
// when user clicks forgot email
authRouter.post("/forgotPassword", requestPasswordResetByEmail)
// reset updated email in database
authRouter.post("/resetPassword", resetUserPasswordByEmail)
// verify if tokens are valid
authRouter.post("/verifyToken", verifyToken)
// SEND OTP VIA PHONENUMBER
authRouter.post("/phoneNumber", requestPasswordResetViaOTP)
// AFRICA

authRouter.post("/get-otp", requireUser, authRole(ROLES.user), createOTPController)
authRouter.post("/verify-otp", requireUser, authRole(ROLES.user), verifyOTPByPhoneNumberController)
export default authRouter;

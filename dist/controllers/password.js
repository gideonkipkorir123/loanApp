"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPasswordResetOTP = exports.requestPasswordResetViaOTP = exports.verifyToken = exports.resetUserPasswordByEmail = exports.requestPasswordResetByEmail = exports.updateLoggedInUserPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../utils/user");
const user_2 = require("../validations/user");
const jwt_1 = require("../utils/jwt");
const nodemailer_1 = require("../utils/nodemailer");
async function updateLoggedInUserPassword(req, res) {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'Please log in again to reset your password' });
        }
        const user = await (0, user_1.getUserById)(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        const newPasswordMatch = await bcrypt_1.default.compare(newPassword, user.password);
        if (newPasswordMatch) {
            return res.status(400).json({ message: 'The new password should be different from the old password,suggest new password' });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const { error } = user_2.newPasswordValidationSchema.validate({ newPassword });
        if (error) {
            const errorMessage = 'Password must contain at least one lowercase letter,Special character, one uppercase letter, atleast one digit, and be at least 8 characters long.';
            return res.status(400).json({ message: errorMessage });
        }
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, salt);
        const updatedUser = await (0, user_1.updateUser)(userId, { password: hashedNewPassword });
        return res.status(200).json({ message: 'Password updated successfully', updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Error updating password: ${error.message}` });
    }
}
exports.updateLoggedInUserPassword = updateLoggedInUserPassword;
async function requestPasswordResetByEmail(req, res) {
    try {
        const { email } = req.body;
        // Retrieve user by email
        const user = await (0, user_1.getUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ message: "Email not found. Please enter a valid email." });
        }
        const resetPasswordToken = await (0, jwt_1.signJWT)({ userId: user._id, email }, '10m');
        // Get user ID by requesting for it since we have the user
        const userId = user._id;
        // Update user with the new reset password token
        await (0, user_1.updateUser)(userId, { resetPasswordToken });
        const subject = 'Reset password';
        const BASE_URL = process.env.BASE_URL;
        const resetLinkUrl = `${BASE_URL}/resetPasswordPage`;
        const data = `<p>
        Click this Link To Reset YouR Password
        
        <\p>
        <a href=${resetLinkUrl}>Reset Password Link <\a>
        
        `;
        await (0, nodemailer_1.sendEmail)({ email, subject, data });
        return res.status(200).json({ message: "Password reset token generated successfully", resetPasswordToken });
    }
    catch (error) {
        console.error(`Error generating/resetting password reset token: ${error.message}`);
        res.status(500).json({ error: { message: "Something went wrong. Please try again." } });
    }
}
exports.requestPasswordResetByEmail = requestPasswordResetByEmail;
async function resetUserPasswordByEmail(req, res) {
    try {
        const { newPassword, resetPasswordToken } = req.body;
        const decodedData = await (0, jwt_1.verifyJWT)(resetPasswordToken);
        if (decodedData.expired === true) {
            return res.status(400).json({ message: "Token Expired" });
        }
        const user = await (0, user_1.getUserByResetToken)(resetPasswordToken);
        if (!user) {
            return res.status(400).json({ message: "User with that token not found" });
        }
        const { error } = user_2.newPasswordValidationSchema.validate({ newPassword });
        if (error) {
            const errorMessage = 'Password must contain at least one lowercase letter,Special character, one uppercase letter, atleast one digit, and be at least 8 characters long.';
            return res.status(400).json({ message: errorMessage });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, salt);
        const updatedUser = await (0, user_1.updateUser)(user._id, { password: hashedNewPassword });
        return res.status(200).json({ message: 'Password updated successfully', updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: `Error updating password: ${error.message}` });
    }
}
exports.resetUserPasswordByEmail = resetUserPasswordByEmail;
// verify issued Tokens 
const verifyToken = async (req, res) => {
    try {
        const token = req.body.token;
        // Verify the token
        const decoded = (0, jwt_1.verifyJWT)(token);
        // If the token is valid, return the decoded information
        return res.status(200).json({ decoded });
    }
    catch (error) {
        return res.status(401).json({ error: { message: "Invalid token" } });
    }
};
exports.verifyToken = verifyToken;
// PASSWORD RESET USING OTP FEATURE
// Assume you have a User model with a phoneNumber field
const requestPasswordResetViaOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        // Check if the phoneNumber exists in the database
        const user = await (0, user_1.getUserByPhoneNumber)(phoneNumber);
        if (!user) {
            return res.status(404).json({ message: 'Phone not found. Please enter a valid phoneNumber number.' });
        }
        if (phoneNumber)
            return res.status(200).json({ message: 'OTP sent successfully.' });
    }
    catch (error) {
        return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
exports.requestPasswordResetViaOTP = requestPasswordResetViaOTP;
const verifyPasswordResetOTP = async (req, res) => {
    try {
        const { resetPasswordOTP } = req.body;
        // Check if the phone and entered OTP match in the database
        const user = await (0, user_1.getUserByPhoneNumber)(resetPasswordOTP);
        if (!user) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        return res.status(200).json({ message: 'OTP verification successful.' });
    }
    catch (error) {
        return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
exports.verifyPasswordResetOTP = verifyPasswordResetOTP;

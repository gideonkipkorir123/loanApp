
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getUserByEmail, getUserById, getUserByPhoneNumber, getUserByResetToken, updateUser } from '../utils/user';
import { newPasswordValidationSchema } from '../validations/user';
import { signJWT, verifyJWT } from '../utils/jwt';
import { sendEmail } from '../utils/nodemailer';
import User from '../models/user';

export async function updateLoggedInUserPassword(req: Request, res: Response) {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: 'Please log in again to reset your password' });
        }

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password as string);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const newPasswordMatch = await bcrypt.compare(newPassword, user.password as string);
        if (newPasswordMatch) {
            return res.status(400).json({ message: 'The new password should be different from the old password,suggest new password' });
        }

        const salt = await bcrypt.genSalt(10);
        const { error } = newPasswordValidationSchema.validate({ newPassword });

        if (error) {
            const errorMessage =
                'Password must contain at least one lowercase letter,Special character, one uppercase letter, atleast one digit, and be at least 8 characters long.';
            return res.status(400).json({ message: errorMessage });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser = await updateUser(userId, { password: hashedNewPassword });

        return res.status(200).json({ message: 'Password updated successfully', updatedUser });
    } catch (error: any) {
        res.status(500).json({ message: `Error updating password: ${error.message}` });
    }
}


export async function requestPasswordResetByEmail(req: Request, res: Response) {
    try {
        const { email } = req.body;

        // Retrieve user by email
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Email not found. Please enter a valid email." });
        }

        const resetPasswordToken = await signJWT({ userId: user._id, email }, '10m')

        // Get user ID by requesting for it since we have the user
        const userId = user._id as string;

        // Update user with the new reset password token
        await updateUser(userId, { resetPasswordToken });
        const subject = 'Reset password'
        const resetLinkUrl = process.env.RESET_PASSWORD_URL
        const data = `<p>
        Click this Link To Reset YouR Password
        
        <\p>
        <a href=${resetLinkUrl}>Reset Password Link <\a>
        
        `
        await sendEmail({ email, subject, data })

        return res.status(200).json({ message: "Password reset token generated successfully", resetPasswordToken });
    } catch (error: any) {
        console.error(`Error generating/resetting password reset token: ${error.message}`);
        res.status(500).json({ error: { message: "Something went wrong. Please try again." } });
    }
}

export async function resetUserPasswordByEmail(req: Request, res: Response) {
    try {
        const { newPassword, resetPasswordToken } = req.body;
        const decodedData = await verifyJWT(resetPasswordToken)
        if (decodedData.expired === true) {
            return res.status(400).json({ message: "Token Expired" })
        }
        const user = await getUserByResetToken(resetPasswordToken)
        if (!user) {
            return res.status(400).json({ message: "User with that token not found" })
        }

        const { error } = newPasswordValidationSchema.validate({ newPassword });

        if (error) {
            const errorMessage =
                'Password must contain at least one lowercase letter,Special character, one uppercase letter, atleast one digit, and be at least 8 characters long.';
            return res.status(400).json({ message: errorMessage });
        }
        const salt = await bcrypt.genSalt(10);

        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser = await updateUser(user._id as string, { password: hashedNewPassword });
        return res.status(200).json({ message: 'Password updated successfully', updatedUser });
    } catch (error: any) {
        res.status(500).json({ message: `Error updating password: ${error.message}` });
    }
}

// verify issued Tokens 

export const verifyToken = async (req: Request, res: Response) => {
    try {
        const token = req.body.token;

        // Verify the token
        const decoded = verifyJWT(token);

        // If the token is valid, return the decoded information
        return res.status(200).json({ decoded });
    } catch (error: any) {
        return res.status(401).json({ error: { message: "Invalid token" } });
    }
};
// PASSWORD RESET USING OTP FEATURE


// Assume you have a User model with a phoneNumber field


export const requestPasswordResetViaOTP = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        // Check if the phoneNumber exists in the database
        const user = await getUserByPhoneNumber(phoneNumber)

        if (!user) {
            return res.status(404).json({ message: 'Phone not found. Please enter a valid phoneNumber number.' });
        }

        // Generate OTP
        // const otp = generateOTP();

        // Send OTP via SMS
        // await sendOTPViaSMS(phoneNumber, otp);
        const userId = user._id as string
        // Save the OTP to the user in the database
        // await updateUser(userId, { resetPasswordOTP: otp });

        return res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error: any) {
        return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
export const verifyPasswordResetOTP = async (req: Request, res: Response) => {
    try {
        const {  resetPasswordOTP  } = req.body;

        // Check if the phone and entered OTP match in the database
        const user = await getUserByPhoneNumber(resetPasswordOTP)

        if (!user) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        return res.status(200).json({ message: 'OTP verification successful.' });
    } catch (error: any) {
        return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};

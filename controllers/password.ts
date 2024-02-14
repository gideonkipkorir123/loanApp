import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { getUserById, updateUser } from '../utils/user';
import { newPasswordValidationSchema } from '../validations/user';

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

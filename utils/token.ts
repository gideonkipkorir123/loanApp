import Token from '../models/token'; 

// Function to validate the reset password token
export async function validateResetPasswordToken(email:string, resetToken:string) {
    try {
        // Find the token in your data storage (e.g., database)
        const tokenData = await Token.findOne({
            email,
            token: resetToken,
            type: 'reset-password',
            expiresAt: { $gt: new Date() },
        });

        // Check if the token is valid
        return !!tokenData;
    } catch (error:any) {
        console.error(`Error validating reset password token: ${error.message}`);
        throw error;
    }
}

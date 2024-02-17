import { Request, Response } from 'express';
import {
    createOTP,
    deleteOTPByOTP,
    deleteOTPEntry,
    getOTPByOTP,
    getOTPByPhoneNumber,
    sendSMS,
} from '../utils/OTP'; // Adjust the import path based on your project structure
import { updateUser } from '../utils/user';

// Create OTP Controller
export const createOTPController = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;
        // Create OTP
        const otpEntry = await createOTP(phoneNumber);
        const response=await sendSMS(phoneNumber,otpEntry.OTP as string)
        // console.log(response.SMSMessageData.Recipients[0].status,"response")
        if (response.SMSMessageData.Recipients[0].status === "Success" ){

            return res.status(201).json({ message: 'OTP created successfully', otpEntry });
        }
        return res.status(500).json({ message: 'Something went wrong' });
    } catch (error: any) {
        return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};

// Read OTP by phone number Controller
export const verifyOTPByPhoneNumberController = async (req: Request, res: Response) => {
    try {
        const { phoneNumber,otp } = req.body
        const userId=req.user?._id as string

        // Get OTP by phone number
        const otpEntry = await getOTPByPhoneNumber(otp,phoneNumber);
        if (otpEntry) {
            const updatedUser = await updateUser(userId, { phoneNumber, phoneVerified:true });
            if (updatedUser){
                const deleteMany=await deleteOTPEntry(phoneNumber)
                return res.status(200).json({ message: 'Phone Verified successflly' });
            }
            return res.status(500).json({ message: 'Something Went wrong' });
        } else {
            res.status(404).json({ message: 'wrong OTP' });
        }
    } catch (error: any) {
        console.error('Error getting OTP by phone number:', error);
        res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};


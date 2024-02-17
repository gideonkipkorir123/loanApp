import OTPModel from '../models/OTP';

import AfricasTalking from 'africastalking';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.AFRICASTALKING_API_KEY as string;
const username = "sandbox";

const africasTalking = AfricasTalking({
    apiKey,
    username,
});

export const sendSMS = async (phoneNumber:string,message:string): Promise<any> => {
   
    const sms = africasTalking.SMS;

    const options = {
        from: "28877",
        to: phoneNumber,
        message: message,
    };

    try {
        const response = await sms.send(options);
        console.log('SMS sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};

// Create OTP
const generateRandomOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const createOTP = async (phoneNumber: string): Promise<any> => {
    try {
        const randomOTP = generateRandomOTP();
        const otpEntry = await OTPModel.create({ phoneNumber, OTP: randomOTP });
        return otpEntry.save();
    } catch (error) {
        console.error('Error creating OTP:', error);
        throw error;
    }
};
export const getOTPByOTP = async (OTP: string): Promise<any> => {
    try {
        const otpEntry = await OTPModel.findOne({ OTP });
        return otpEntry;
    } catch (error) {
        console.error('Error getting OTP by OTP', error);
        throw error;
    }
};
export const deleteOTPByOTP = async (OTP: string): Promise<any> => {
    try {
        const deletedOTP = await OTPModel.findOneAndDelete({ OTP });
        return deletedOTP;
    } catch (error) {
        console.error('Error deleting OTP by OTP', error);
        throw error;
    }
};
export const getOTPByPhoneNumber = async (OTP: string,phoneNumber:string): Promise<any> => {
    try {
        const otpEntry = await OTPModel.findOne({ OTP,phoneNumber });
        return otpEntry;
    } catch (error) {
        console.error('Error getting OTP by phone number:', error);
        throw error;
    }
};
export const deleteOTPEntry = async (phoneNumber:string): Promise<any> => {
    try {
        const otpEntry = await OTPModel.deleteMany({ phoneNumber });
        return otpEntry;
    } catch (error) {
        console.error('Error getting OTP by phone number:', error);
        throw error;
    }
};
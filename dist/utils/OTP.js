"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOTPEntry = exports.getOTPByPhoneNumber = exports.deleteOTPByOTP = exports.getOTPByOTP = exports.createOTP = exports.sendSMS = void 0;
const OTP_1 = __importDefault(require("../models/OTP"));
const africastalking_1 = __importDefault(require("africastalking"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.AFRICASTALKING_API_KEY;
const username = "sandbox";
const africasTalking = (0, africastalking_1.default)({
    apiKey,
    username,
});
const sendSMS = async (phoneNumber, message) => {
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
    }
    catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};
exports.sendSMS = sendSMS;
// Create OTP
const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
const createOTP = async (phoneNumber) => {
    try {
        const randomOTP = generateRandomOTP();
        const otpEntry = await OTP_1.default.create({ phoneNumber, OTP: randomOTP });
        return otpEntry.save();
    }
    catch (error) {
        console.error('Error creating OTP:', error);
        throw error;
    }
};
exports.createOTP = createOTP;
const getOTPByOTP = async (OTP) => {
    try {
        const otpEntry = await OTP_1.default.findOne({ OTP });
        return otpEntry;
    }
    catch (error) {
        console.error('Error getting OTP by OTP', error);
        throw error;
    }
};
exports.getOTPByOTP = getOTPByOTP;
const deleteOTPByOTP = async (OTP) => {
    try {
        const deletedOTP = await OTP_1.default.findOneAndDelete({ OTP });
        return deletedOTP;
    }
    catch (error) {
        console.error('Error deleting OTP by OTP', error);
        throw error;
    }
};
exports.deleteOTPByOTP = deleteOTPByOTP;
const getOTPByPhoneNumber = async (OTP, phoneNumber) => {
    try {
        const otpEntry = await OTP_1.default.findOne({ OTP, phoneNumber });
        return otpEntry;
    }
    catch (error) {
        console.error('Error getting OTP by phone number:', error);
        throw error;
    }
};
exports.getOTPByPhoneNumber = getOTPByPhoneNumber;
const deleteOTPEntry = async (phoneNumber) => {
    try {
        const otpEntry = await OTP_1.default.deleteMany({ phoneNumber });
        return otpEntry;
    }
    catch (error) {
        console.error('Error getting OTP by phone number:', error);
        throw error;
    }
};
exports.deleteOTPEntry = deleteOTPEntry;

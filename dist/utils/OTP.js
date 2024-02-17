"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.generateOTP = void 0;
const africastalking_1 = __importDefault(require("africastalking"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize the SDK
const apiKey = process.env.AFRICASTALKING_API_KEY;
const username = 'sandbox'; // Note: It should be 'sandbox' instead of 'sandBox'
const africasTalking = (0, africastalking_1.default)({
    apiKey,
    username,
});
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
exports.generateOTP = generateOTP;
const sendSMS = async (to, message) => {
    const sms = africasTalking.SMS;
    const options = {
        from: '+254710246806',
        to,
        message,
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
// Example of using generateOTP and sendSMS
const recipientPhoneNumber = '+254715134415'; // Change this to the desired recipient's phone number
const otp = generateOTP();
const otpMessage = `Your OTP is: ${otp}`;
try {
    // generates error 
    await (0, exports.sendSMS)(recipientPhoneNumber, otpMessage);
    console.log('OTP sent successfully');
}
catch (error) {
    console.error('Error sending OTP:', error.message);
}

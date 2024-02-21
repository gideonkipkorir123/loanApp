"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const africastalking_1 = __importDefault(require("africastalking"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.AFRICASTALKING_API_KEY;
const username = "sandbox";
const africasTalking = (0, africastalking_1.default)({
    apiKey,
    username,
});
const sendSMS = async () => {
    const sms = africasTalking.SMS;
    const options = {
        from: "28877",
        to: '+254715134415',
        message: 'TEST',
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

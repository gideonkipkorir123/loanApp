"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPByPhoneNumberController = exports.createOTPController = void 0;
const OTP_1 = require("../utils/OTP"); // Adjust the import path based on your project structure
const user_1 = require("../utils/user");
// Create OTP Controller
const createOTPController = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        // Create OTP
        const otpEntry = await (0, OTP_1.createOTP)(phoneNumber);
        const response = await (0, OTP_1.sendSMS)(phoneNumber, otpEntry.OTP);
        // console.log(response.SMSMessageData.Recipients[0].status,"response")
        if (response.SMSMessageData.Recipients[0].status === "Success") {
            return res.status(201).json({ message: 'OTP created successfully', otpEntry });
        }
        return res.status(500).json({ message: 'Something went wrong' });
    }
    catch (error) {
        return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
exports.createOTPController = createOTPController;
// Read OTP by phone number Controller
const verifyOTPByPhoneNumberController = async (req, res) => {
    var _a;
    try {
        const { phoneNumber, otp } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Get OTP by phone number
        const otpEntry = await (0, OTP_1.getOTPByPhoneNumber)(otp, phoneNumber);
        if (otpEntry) {
            const updatedUser = await (0, user_1.updateUser)(userId, { phoneNumber, phoneVerified: true });
            if (updatedUser) {
                const deleteMany = await (0, OTP_1.deleteOTPEntry)(phoneNumber);
                return res.status(200).json({ message: 'Phone Verified successflly' });
            }
            return res.status(500).json({ message: 'Something Went wrong' });
        }
        else {
            res.status(404).json({ message: 'wrong OTP' });
        }
    }
    catch (error) {
        console.error('Error getting OTP by phone number:', error);
        res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
exports.verifyOTPByPhoneNumberController = verifyOTPByPhoneNumberController;

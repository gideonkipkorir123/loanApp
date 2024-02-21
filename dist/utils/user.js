"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBySignToken = exports.emailExists = exports.deleteUser = exports.updateUserByEmail = exports.updateUser = exports.getAllUsers = exports.getUserByResetOTP = exports.getUserByResetToken = exports.getUserByPhoneNumber = exports.getUserByEmail = exports.getUserById = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
// CREATE (Insert a new user)
async function createUser(user) {
    try {
        const newUser = new user_1.default(user);
        const createdUser = await newUser.save();
        return createdUser;
    }
    catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}
exports.createUser = createUser;
// READ (Get a user by ID)
async function getUserById(userId) {
    try {
        const user = await user_1.default.findById(userId).lean();
        return user; //error
    }
    catch (error) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
}
exports.getUserById = getUserById;
async function getUserByEmail(email) {
    try {
        const user = await user_1.default.findOne({ email }).lean();
        return user;
    }
    catch (error) {
        throw new Error(`Error getting user by Email: ${error.message}`);
    }
}
exports.getUserByEmail = getUserByEmail;
async function getUserByPhoneNumber(phoneNumber) {
    try {
        const user = await user_1.default.findOne({ phoneNumber }).lean();
        return user;
    }
    catch (error) {
        throw new Error(`Error getting user by phoneNumber: ${error.message}`);
    }
}
exports.getUserByPhoneNumber = getUserByPhoneNumber;
async function getUserByResetToken(resetPasswordToken) {
    try {
        const user = await user_1.default.findOne({ resetPasswordToken }).lean();
        return user; //error
    }
    catch (error) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
}
exports.getUserByResetToken = getUserByResetToken;
// get user via reset otp sent via sms
async function getUserByResetOTP(resetPasswordOTP) {
    try {
        const user = await user_1.default.findOne({ resetPasswordOTP }).lean();
        return user; //error
    }
    catch (error) {
        throw new Error(`Error getting user by resetPasswordOTP: ${error.message}`);
    }
}
exports.getUserByResetOTP = getUserByResetOTP;
// READ (Get all users)
async function getAllUsers() {
    try {
        const users = await user_1.default.find().lean();
        return users;
    }
    catch (error) {
        throw new Error(`Error getting all users: ${error.message}`);
    }
}
exports.getAllUsers = getAllUsers;
// UPDATE (Update a user by ID)
async function updateUser(userId, userData) {
    try {
        const user = await user_1.default.findByIdAndUpdate(userId, userData, { new: true }).lean();
        return user;
    }
    catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}
exports.updateUser = updateUser;
async function updateUserByEmail(email, userData) {
    try {
        const user = await user_1.default.findOneAndUpdate({ email }, userData, { new: true }).lean();
        return user;
    }
    catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}
exports.updateUserByEmail = updateUserByEmail;
// DELETE (Delete a user by ID)
async function deleteUser(userId) {
    try {
        await user_1.default.findByIdAndDelete(userId);
    }
    catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}
exports.deleteUser = deleteUser;
const emailExists = async (email) => {
    const unverifiedEmail = await user_1.default.findOne({ email }).lean();
    return !!unverifiedEmail; // Return true if the user exists, false otherwise
};
exports.emailExists = emailExists;
const getUserBySignToken = async (email, signEmailToken) => {
    try {
        const otpEntry = await user_1.default.findOne({ email, signEmailToken });
        return otpEntry;
    }
    catch (error) {
        console.error('Error getting signToken by email:', error);
        throw error;
    }
};
exports.getUserBySignToken = getUserBySignToken;

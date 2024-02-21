"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileImage = void 0;
const user_1 = __importDefault(require("../../models/user"));
const uploadImage_1 = require("./uploadImage");
const updateUserProfileImage = async (userId, file) => {
    try {
        const imageURL = await (0, uploadImage_1.uploadImage)(file);
        await user_1.default.findByIdAndUpdate(userId, { profileImageURL: imageURL });
    }
    catch (error) {
        console.error("Error updating user profile image:", error);
        throw error;
    }
};
exports.updateUserProfileImage = updateUserProfileImage;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileImage = void 0;
const uuid_1 = require("uuid");
const firebase_1 = require("./firebase");
const storage_1 = require("@firebase/storage");
const user_1 = __importDefault(require("../../models/user"));
const image_size_1 = __importDefault(require("image-size"));
const isImageValid = (file) => {
    const allowedExtensions = ['.jpg', '.webp', '.png'];
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        console.error('Invalid file type. Only .jpg, .webp, and .png allowed.');
        return false;
    }
    return true;
};
const getImageDimensions = (buffer) => {
    try {
        const dimensions = (0, image_size_1.default)(buffer);
        if (dimensions.width !== undefined && dimensions.height !== undefined) {
            return { width: dimensions.width, height: dimensions.height };
        }
        return undefined;
    }
    catch (error) {
        console.error('Error getting image dimensions:', error);
        return undefined;
    }
};
const uploadFile = async (file, directory) => {
    try {
        if (!file) {
            throw new Error('File is undefined.');
        }
        const fileBuffer = file.buffer;
        if (!isImageValid(file)) {
            throw new Error('Invalid file type. Only .jpg, .webp, and .png allowed.');
        }
        const dimensions = getImageDimensions(fileBuffer);
        if (!dimensions) {
            console.error('Invalid image dimensions.');
            throw new Error('Invalid image dimensions.');
        }
        // Generate a unique filename using uuid
        const uniqueFilename = `${(0, uuid_1.v4)()}_${file.originalname}`;
        const storageRef = (0, storage_1.ref)(firebase_1.storage, `${directory}/${uniqueFilename}`);
        await (0, storage_1.uploadBytes)(storageRef, fileBuffer);
        const downloadURL = await (0, storage_1.getDownloadURL)(storageRef);
        return downloadURL;
    }
    catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
const updateUserProfileImage = async (userId, imageFile, frontIdFile, backIdFile, signatureFile) => {
    try {
        const imageURL = await uploadFile(imageFile, 'images');
        const frontIdURL = await uploadFile(frontIdFile, 'documents');
        const backIdURL = await uploadFile(backIdFile, 'documents');
        const signatureURL = await uploadFile(signatureFile, 'documents');
        const timestamp = new Date();
        await user_1.default.findByIdAndUpdate(userId, {
            profileImageURL: imageURL,
            frontIdURL,
            backIdURL,
            signatureURL,
            profileImageUpdatedAt: timestamp,
        });
        return {
            imageURL,
            frontIdURL,
            backIdURL,
            signatureURL,
        };
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
exports.updateUserProfileImage = updateUserProfileImage;

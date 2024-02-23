"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesHandler = exports.updateUserProfileImageHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const uploadDocs_1 = require("../utils/firebase/uploadDocs");
// Configure Multer storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Multer middleware for handling file uploads
const uploadFilesHandler = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'frontId', maxCount: 1 },
    { name: 'backId', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
]);
exports.uploadFilesHandler = uploadFilesHandler;
// Controller function for updating user profile image
const updateUserProfileImageHandler = async (req, res) => {
    var _a;
    try {
        if (!req.files) {
            throw new Error('No files uploaded');
        }
        const files = req.files;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            throw new Error('Unauthorized');
        }
        // Extract individual files
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
        const frontIdFile = Array.isArray(files.frontId) ? files.frontId[0] : files.frontId;
        const backIdFile = Array.isArray(files.backId) ? files.backId[0] : files.backId;
        const signatureFile = Array.isArray(files.signature) ? files.signature[0] : files.signature;
        // Check for the existence of files before proceeding
        if (!imageFile || !frontIdFile || !backIdFile || !signatureFile) {
            throw new Error('Required files are missing');
        }
        // Update user profile image using utility function
        const userProfileUrls = await (0, uploadDocs_1.updateUserProfileImage)(userId, imageFile, frontIdFile, backIdFile, signatureFile);
        res.status(200).json({
            message: 'Files uploaded successfully',
            userProfileUrls,
        });
    }
    catch (error) {
        console.error('Error uploading files::', error.message);
        res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
exports.updateUserProfileImageHandler = updateUserProfileImageHandler;

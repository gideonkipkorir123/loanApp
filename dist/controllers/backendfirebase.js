"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesHandler = exports.updateUserProfileImageHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const backendUpload_1 = require("../utils/firebase/backendUpload");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const uploadFilesHandler = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'frontId', maxCount: 1 },
    { name: 'backId', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
]);
exports.uploadFilesHandler = uploadFilesHandler;
const updateUserProfileImageHandler = async (req, res) => {
    var _a;
    try {
        if (!req.files) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const files = req.files;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Extract individual files
        const imageFile = files.image ? files.image[0] : undefined;
        const frontIdFile = files.frontId ? files.frontId[0] : undefined;
        const backIdFile = files.backId ? files.backId[0] : undefined;
        const signatureFile = files.signature ? files.signature[0] : undefined;
        // Check file existence before processing
        if (!imageFile || !frontIdFile || !backIdFile || !signatureFile) {
            return res.status(400).json({ message: 'Required files are missing' });
        }
        // Update user profile image
        const userprofileURL = await (0, backendUpload_1.updateUserProfileImage)(userId, imageFile, frontIdFile, backIdFile, signatureFile);
        res.status(200).json({
            message: 'Files uploaded successfully',
            userprofileURL,
        });
    }
    catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};
exports.updateUserProfileImageHandler = updateUserProfileImageHandler;

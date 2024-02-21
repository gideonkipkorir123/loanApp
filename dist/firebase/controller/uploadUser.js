"use strict";
// exampleRoute.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadImageHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const updateUserImage_1 = require("../utils/updateUserImage");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
const uploadImageHandler = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming you have user information in the request
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        await (0, updateUserImage_1.updateUserProfileImage)(userId, file);
        res.status(200).json({ message: "Image uploaded successfully" });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: { message: "Something went wrong. Please try again." } });
    }
};
exports.uploadImageHandler = uploadImageHandler;

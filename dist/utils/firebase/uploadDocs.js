"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileImage = void 0;
const uuid_1 = require("uuid");
const stream_1 = require("stream");
const user_1 = __importDefault(require("../../models/user"));
const image_size_1 = __importDefault(require("image-size"));
const firebase_1 = require("./firebase");
class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}
const MAX_FILE_SIZE_MB = 3;
const isImageValid = (file) => {
    const allowedExtensions = ['.jpg', '.webp', '.png'];
    // Check file extension
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        console.error('Invalid file type. Only .jpg, .webp, and .png allowed.');
        throw new CustomError('Invalid file type. Only .jpg, .webp, and .png allowed.');
    }
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024); // Convert file size to megabytes
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
        console.error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`);
        throw new CustomError(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`);
    }
    return true;
};
const getImageDimensions = (buffer) => {
    try {
        const dimensions = (0, image_size_1.default)(buffer);
        if (dimensions.width !== undefined && dimensions.height !== undefined) {
            return { width: dimensions.width, height: dimensions.height };
        }
        throw new CustomError('Invalid image dimensions.');
    }
    catch (error) {
        console.error('Error getting image dimensions:', error.message);
        throw new CustomError('Error getting image dimensions.');
    }
};
const uploadFile = async (file, directory) => {
    try {
        if (!file) {
            throw new CustomError('File is undefined.');
        }
        // Check if the image is valid
        if (!isImageValid(file)) {
            throw new CustomError('Invalid image.');
        }
        const dimensions = getImageDimensions(file.buffer);
        if (!dimensions) {
            console.error('Invalid image dimensions.');
            throw new CustomError('Invalid image dimensions.');
        }
        // Generate a unique filename using uuid
        const uniqueFilename = `${(0, uuid_1.v4)()}_${file.originalname}`;
        const fileStream = new stream_1.Writable({
            write: (chunk, encoding, next) => {
                firebase_1.bucket.file(`${directory}/${uniqueFilename}`).createWriteStream()
                    .on('finish', next)
                    .on('error', (error) => {
                    console.error('Error uploading file:', error.message);
                    next(error.message);
                })
                    .end(chunk);
            },
        });
        await new Promise((resolve, reject) => {
            fileStream
                .on('finish', resolve)
                .on('error', reject);
            fileStream.write(file.buffer);
            fileStream.end();
        });
        const downloadURL = `https://storage.googleapis.com/${firebase_1.bucket.name}/${directory}/${uniqueFilename}`;
        return downloadURL;
    }
    catch (error) {
        console.error('Error uploading file:', error.message);
        throw new CustomError('Error uploading file.');
    }
};
const updateUserProfileImage = async (userId, imageFile, frontIdFile, backIdFile, signatureFile) => {
    try {
        const uploadFiles = async (file, directory) => {
            if (!file) {
                throw new CustomError('File is undefined.');
            }
            const files = Array.isArray(file) ? file : [file];
            const downloadURLs = [];
            for (const individualFile of files) {
                const fileBuffer = individualFile.buffer;
                // Check if the image is valid
                if (!isImageValid(individualFile)) {
                    throw new CustomError('Invalid image.');
                }
                const dimensions = getImageDimensions(fileBuffer);
                if (!dimensions) {
                    console.error('Invalid image dimensions.');
                    throw new CustomError('Invalid image dimensions.');
                }
                // Generate a unique filename using uuid
                const uniqueFilename = `${(0, uuid_1.v4)()}_${individualFile.originalname}`;
                const fileStream = new stream_1.Writable({
                    write: (chunk, encoding, next) => {
                        firebase_1.bucket.file(`${directory}/${uniqueFilename}`).createWriteStream()
                            .on('finish', next)
                            .on('error', (error) => {
                            console.error('Error uploading file:', error.message);
                            next(error.message);
                        })
                            .end(chunk);
                    },
                });
                await new Promise((resolve, reject) => {
                    fileStream
                        .on('finish', resolve)
                        .on('error', reject);
                    fileStream.write(fileBuffer);
                    fileStream.end();
                });
                const downloadURL = `https://storage.googleapis.com/${firebase_1.bucket.name}/${directory}/${uniqueFilename}`;
                downloadURLs.push(downloadURL);
            }
            return downloadURLs;
        };
        const [imageURL, frontIdURL, backIdURL, signatureURL] = await Promise.all([
            uploadFiles(imageFile, 'images'),
            uploadFiles(frontIdFile, 'documents'),
            uploadFiles(backIdFile, 'documents'),
            uploadFiles(signatureFile, 'documents'),
        ]);
        const timestamp = new Date();
        await user_1.default.findByIdAndUpdate(userId, {
            profileImageURL: imageURL[0],
            frontIdURL: frontIdURL[0],
            backIdURL: backIdURL[0],
            signatureURL: signatureURL[0],
            profileImageUpdatedAt: timestamp,
        });
        return {
            imageURL: imageURL[0],
            frontIdURL: frontIdURL[0],
            backIdURL: backIdURL[0],
            signatureURL: signatureURL[0],
        };
    }
    catch (error) {
        console.error('Error updating user profile:', error.message);
        throw new CustomError('Error updating user profile.');
    }
};
exports.updateUserProfileImage = updateUserProfileImage;

import { Request, Response } from 'express';
import multer from 'multer';
import { updateUserProfileImage } from '../utils/firebase/uploadDocs';

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Multer middleware for handling file uploads
const uploadFilesHandler = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'frontId', maxCount: 1 },
    { name: 'backId', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
]);

// Controller function for updating user profile image
const updateUserProfileImageHandler = async (req: Request, res: Response) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        console.log(req.files, "req.files");

        const files = req.files as {
            image?: Express.Multer.File | Express.Multer.File[]; // Updated to accept an array or a single file
            frontId?: Express.Multer.File | Express.Multer.File[]; // Updated to accept an array or a single file
            backId?: Express.Multer.File | Express.Multer.File[]; // Updated to accept an array or a single file
            signature?: Express.Multer.File | Express.Multer.File[]; // Updated to accept an array or a single file
        };

        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract individual files
        const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
        const frontIdFile = Array.isArray(files.frontId) ? files.frontId[0] : files.frontId;
        const backIdFile = Array.isArray(files.backId) ? files.backId[0] : files.backId;
        const signatureFile = Array.isArray(files.signature) ? files.signature[0] : files.signature;

        // Check for the existence of files before proceeding
        if (!imageFile || !frontIdFile || !backIdFile || !signatureFile) {
            return res.status(400).json({ message: 'Required files are missing' });
        }

        // Update user profile image using utility function
        const userProfileUrls = await updateUserProfileImage(
            userId,
            imageFile,
            frontIdFile,
            backIdFile,
            signatureFile
        );

        res.status(200).json({
            message: 'Files uploaded successfully',
            userProfileUrls,
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
    }
};

export { updateUserProfileImageHandler, uploadFilesHandler };

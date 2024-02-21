"use strict";
// import { Request, Response } from 'express';
// import multer from 'multer';
// import { updateUserProfileImage } from '../utils/firebase/uploadDocs';
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const uploadFilesHandler = upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'frontId', maxCount: 1 },
//     { name: 'backId', maxCount: 1 },
//     { name: 'signature', maxCount: 1 },
// ]);
// const updateUserProfileImageHandler = async (req: Request, res: Response) => {
//     try {
//         if (!req.files) {
//             return res.status(400).json({ message: 'No files uploaded' });
//         }
//         const files = req.files as {
//             image?: Express.Multer.File[];
//             frontId?: Express.Multer.File[];
//             backId?: Express.Multer.File[];
//             signature?: Express.Multer.File[];
//         };
//         const userId = req.user?._id;
//         if (!userId) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         // Extract individual files
//         const imageFile = files.image ? files.image[0] : undefined;
//         const frontIdFile = files.frontId ? files.frontId[0] : undefined;
//         const backIdFile = files.backId ? files.backId[0] : undefined;
//         const signatureFile = files.signature ? files.signature[0] : undefined;
//         // Update user profile image
//         const userprofileURL = imageFile
//             ? await updateUserProfileImage(userId, imageFile, frontIdFile as Express.Multer.File, backIdFile as Express.Multer.File, signatureFile as Express.Multer.File)
//             : undefined;
//         res.status(200).json({
//             message: 'Files uploaded successfully',
//             userprofileURL,
//         });
//     } catch (error) {
//         console.error('Error uploading files:', error);
//         res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } });
//     }
// };
// export { updateUserProfileImageHandler, uploadFilesHandler };

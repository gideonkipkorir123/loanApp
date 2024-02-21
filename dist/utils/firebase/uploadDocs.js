"use strict";
// import { v4 as uuidv4 } from 'uuid';
// import { storage } from "./firebase";
// import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
// import User from "../../models/user";
// import sizeOf from 'image-size';
// const isImageValid = (file: Express.Multer.File): boolean => {
//     const allowedExtensions = ['.jpg', '.webp', '.png'];
//     const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
//     if (!allowedExtensions.includes(fileExtension)) {
//         console.error('Invalid file type. Only .jpg, .webp, and .png allowed.');
//         return false;
//     }
//     return true;
// };
// const getImageDimensions = (buffer: Buffer): { width: number; height: number } | undefined => {
//     try {
//         const dimensions = sizeOf(buffer);
//         if (dimensions.width !== undefined && dimensions.height !== undefined) {
//             return { width: dimensions.width, height: dimensions.height };
//         }
//         return undefined;
//     } catch (error) {
//         console.error('Error getting image dimensions:', error);
//         return undefined;
//     }
// };
// const uploadFile = async (file: Express.Multer.File, directory: string): Promise<string> => {
//     try {
//         if (!file) {
//             throw new Error('File is undefined.');
//         }
//         const fileBuffer = file.buffer;
//         if (!isImageValid(file)) {
//             throw new Error('Invalid file type. Only .jpg, .webp, and .png allowed.');
//         }
//         const dimensions = getImageDimensions(fileBuffer);
//         if (!dimensions) {
//             console.error('Invalid image dimensions.');
//             throw new Error('Invalid image dimensions.');
//         }
//         // Generate a unique filename using uuid
//         const uniqueFilename = `${uuidv4()}_${file.originalname}`;
//         const storageRef = ref(storage, `${directory}/${uniqueFilename}`);
//         await uploadBytes(storageRef, fileBuffer);
//         const downloadURL = await getDownloadURL(storageRef);
//         return downloadURL;
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         throw error;
//     }
// };
// const updateUserProfileImage = async (
//     userId: string,
//     imageFile: Express.Multer.File,
//     frontIdFile: Express.Multer.File,
//     backIdFile: Express.Multer.File,
//     signatureFile: Express.Multer.File
// ): Promise<{ imageURL: string, frontIdURL: string, backIdURL: string, signatureURL: string }> => {
//     try {
//         const imageURL = await uploadFile(imageFile, 'images');
//         const frontIdURL = await uploadFile(frontIdFile, 'documents');
//         const backIdURL = await uploadFile(backIdFile, 'documents');
//         const signatureURL = await uploadFile(signatureFile, 'documents');
//         const timestamp = new Date();
//         await User.findByIdAndUpdate(userId, {
//             profileImageURL: imageURL,
//             frontIdURL,
//             backIdURL,
//             signatureURL,
//             profileImageUpdatedAt: timestamp,
//         });
//         return {
//             imageURL,
//             frontIdURL,
//             backIdURL,
//             signatureURL,
//         };
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         throw error;
//     }
// };
// export { updateUserProfileImage };

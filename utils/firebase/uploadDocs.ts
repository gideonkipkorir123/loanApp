import { v4 as uuidv4 } from 'uuid';
import { Writable } from 'stream';
import User from '../../models/user';
import sizeOf from 'image-size';
import { bucket } from './firebase';

const isImageValid = (file: Express.Multer.File): boolean => {
    const allowedExtensions = ['.jpg', '.webp', '.png'];

    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        console.error('Invalid file type. Only .jpg, .webp, and .png allowed.');
        return false;
    }

    return true;
};

const getImageDimensions = (buffer: Buffer): { width: number; height: number } | undefined => {
    try {
        const dimensions = sizeOf(buffer);
        if (dimensions.width !== undefined && dimensions.height !== undefined) {
            return { width: dimensions.width, height: dimensions.height };
        }
        return undefined;
    } catch (error) {
        console.error('Error getting image dimensions:', error);
        return undefined;
    }
};

const uploadFile = async (file: Express.Multer.File, directory: string): Promise<string> => {
    try {
        if (!file) {
            throw new Error('File is undefined.');
        }

        if (!isImageValid(file)) {
            throw new Error('Invalid file type. Only .jpg, .webp, and .png allowed.');
        }

        const dimensions = getImageDimensions(file.buffer);

        if (!dimensions) {
            console.error('Invalid image dimensions.');
            throw new Error('Invalid image dimensions.');
        }

        // Generate a unique filename using uuid
        const uniqueFilename = `${uuidv4()}_${file.originalname}`;

        const fileStream = new Writable({
            write: (chunk, encoding, next) => {
                bucket.file(`${directory}/${uniqueFilename}`).createWriteStream()
                    .on('finish', next)
                    .on('error', (error) => {
                        console.error('Error uploading file:', error);
                        next(error);
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

        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${directory}/${uniqueFilename}`;
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

const updateUserProfileImage = async (
    userId: string,
    imageFile: Express.Multer.File | Express.Multer.File[] | undefined,
    frontIdFile: Express.Multer.File | Express.Multer.File[] | undefined,
    backIdFile: Express.Multer.File | Express.Multer.File[] | undefined,
    signatureFile: Express.Multer.File | Express.Multer.File[] | undefined
): Promise<{ imageURL: string, frontIdURL: string, backIdURL: string, signatureURL: string }> => {
    try {
        const uploadFiles = async (file: Express.Multer.File | Express.Multer.File[] | undefined, directory: string): Promise<string[]> => {
            if (!file) {
                throw new Error('File is undefined.');
            }

            const files = Array.isArray(file) ? file : [file];
            const downloadURLs: string[] = [];

            for (const individualFile of files) {
                const fileBuffer = individualFile.buffer;

                if (!isImageValid(individualFile)) {
                    throw new Error('Invalid file type. Only .jpg, .webp, and .png allowed.');
                }

                const dimensions = getImageDimensions(fileBuffer);

                if (!dimensions) {
                    console.error('Invalid image dimensions.');
                    throw new Error('Invalid image dimensions.');
                }

                // Generate a unique filename using uuid
                const uniqueFilename = `${uuidv4()}_${individualFile.originalname}`;

                const fileStream = new Writable({
                    write: (chunk, encoding, next) => {
                        bucket.file(`${directory}/${uniqueFilename}`).createWriteStream()
                            .on('finish', next)
                            .on('error', (error) => {
                                console.error('Error uploading file:', error);
                                next(error);
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

                const downloadURL = `https://storage.googleapis.com/${bucket.name}/${directory}/${uniqueFilename}`;
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

        await User.findByIdAndUpdate(userId, {
            profileImageURL: imageURL[0], // Assuming only one image is uploaded
            frontIdURL: frontIdURL[0], // Assuming only one frontId is uploaded
            backIdURL: backIdURL[0], // Assuming only one backId is uploaded
            signatureURL: signatureURL[0], // Assuming only one signature is uploaded
            profileImageUpdatedAt: timestamp,
        });

        return {
            imageURL: imageURL[0], // Assuming only one image is uploaded
            frontIdURL: frontIdURL[0], // Assuming only one frontId is uploaded
            backIdURL: backIdURL[0], // Assuming only one backId is uploaded
            signatureURL: signatureURL[0], // Assuming only one signature is uploaded
        };
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export { updateUserProfileImage };
